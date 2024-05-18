const { analyzeTextService } = require('../services')
const { asyncWrap } = require('../middlewares');

const analyzeText = asyncWrap(async (req, res) => {
    console.log("파일 받기 과정 실행, 카카오 txt라고 가정")

    // 보안 처리 필요, 일단 txt 내용 추출만 구현
    if (req.file && req.file.buffer) {
        const textContent = req.file.buffer.toString('utf-8')
        const opAge_range = req.body.opAge_range
        const userId = req.user.userId
        const analysisType = (typeof req.body.analysisType == Boolean) ? req.body.analysisType : req.body.analysisType == "true" ? true : false
        const result = await analyzeTextService(userId, analysisType, opAge_range, textContent)
        if(result == null) {
            res.status(400).send("데이터 처리 중 오류 발생")
        } else {
            res.status(200).send(result)
        }
    } else {
        res.status(400).send("요청 중 오류 발생")
    }
})

module.exports = {
    analyzeText
}

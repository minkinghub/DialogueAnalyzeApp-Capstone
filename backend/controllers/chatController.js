const { analyzeTextService } = require('../services')
const { asyncWrap } = require('../middlewares');

let modelEndpoint = null

const analyzeText = asyncWrap(async (req, res) => {
    console.log("파일 받기 과정 실행, 카카오 txt라고 가정")

    if(modelEndpoint == null) {
        return res.status(400).send("GPU 서버 엔드포인트 없음")
    }

    // 보안 처리 필요, 일단 txt 내용 추출만 구현
    if (req.file && req.file.buffer) {
        const content = req.file.buffer.toString('utf-8')
        const opAge_range = req.body.opAge_range
        const userId = req.user.userId
        const analysisType = (typeof req.body.analysisType == Boolean) ? req.body.analysisType : req.body.analysisType == "true" ? true : false
        const result = await analyzeTextService(userId, analysisType, opAge_range, content, modelEndpoint)
        if(result == null) {
            res.status(400).send("데이터 처리 중 오류 발생")
        } else {
            res.status(200).send(result)
        }
    } else {
        res.status(400).send("요청 중 오류 발생")
    }
})

const GPUserverOpen = asyncWrap(async (req, res) => {
    console.log("설정 전 : ", modelEndpoint)
    const url = req.body.modelEndpoint
    modelEndpoint = url
    console.log("설정 후 : ", modelEndpoint)

    return res.status(200).send({ message : `설정 완료, 서버 엔드포인트 : ${modelEndpoint}`})
})

const GPUserverClose = asyncWrap(async (req, res) => {
    console.log("설정 전 : ", modelEndpoint)
    modelEndpoint = null
    console.log("설정 후 : ", modelEndpoint)

    return res.status(200).send({ message : `삭제 완료, 서버 엔드포인트 : ${modelEndpoint}`})
})

module.exports = {
    analyzeText,
    GPUserverOpen,
    GPUserverClose
}
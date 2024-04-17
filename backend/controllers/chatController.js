const { analyzeTextService } = require('../services')
const { asyncWrap } = require('../middlewares');

const analyzeText = asyncWrap(async (req, res) => {
    console.log("파일 받기 과정 실행, 카카오 txt라고 가정")

    // 보안 처리 필요, 일단 txt 내용 추출만 구현
    if (req.file && req.file.buffer) {
        const textContent = req.file.buffer.toString('utf-8');
        await analyzeTextService(textContent)
        res.send("파일 분석 완료");
    } else {
        res.status(400).send("파일이 전송되지 않았습니다.");
    }
})

module.exports = {
    analyzeText
}
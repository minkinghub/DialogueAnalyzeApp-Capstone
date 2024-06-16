const { analyzeTextService } = require('../services')
const { asyncWrap } = require('../middlewares');

let modelEndpoint = null

const textExtensionList = ['txt']
const audioExtensionList = ['mp3', 'wav', 'm4a']

const analyzeText = asyncWrap(async (req, res) => {

    // if(modelEndpoint == null) {
    //     return res.status(400).send({ errorCode : 'E001', errorMessage : 'No Set GPU Endpoint'})
    // }

    // 보안 처리 필요, 일단 txt 내용 추출만 구현
    if (req.file && req.file.buffer) {
        const dataType = (typeof req.body.dataType == Boolean) ? req.body.dataType : (req.body.dataType == "true") ? true : false
        // 텍스트 파일 == true, 음성 파일 false
        const content = (dataType == true) ? req.file.buffer.toString('utf-8') : req.file.buffer
        const fileName = req.file.originalname
        const fileExtension = fileName.split('.').pop().trim()
        const userId = req.user.userId
        if(dataType == true) { // 텍스트 파일인 경우
            if(!textExtensionList.includes(fileExtension)) return res.status(400).send({ errorCode : 'E002', errorMessage: "Incorrect File Extension"})
        } else { // 음성 파일인 경우
            if(!audioExtensionList.includes(fileExtension)) return res.status(400).send({ errorCode : 'E002', errorMessage: "Incorrect File Extension"})
        }

        const result = await analyzeTextService(userId, content, dataType, fileExtension, modelEndpoint)
        if(result.status != 0) {
            let errorMessage = ""
            switch(result.status) {
                case 1:
                    errorCode = 'E101'
                    errorMessage = "GPU Server Connecting Error"
                    modelEndpoint = null
                    break
                case 2:
                    errorCode = 'E102'
                    errorMessage = "Processing Data Error"
                    break
                default:
                    errorCode = 'E102'
                    errorMessage = "Unknown Error"
                    break
            }

            return res.status(400).send({ errorCode: errorCode, errorMessage: errorMessage })
        } else {
            res.status(200).send({historyKey : result.historyKey})
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
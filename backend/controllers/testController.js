const { testService } = require('../services')
const { asyncWrap } = require('../middlewares');

const testController = asyncWrap(async (req, res) => {
    console.log("testController 실행")
    const headers = req.headers["authorization"]
    // const kakaoToken = headers.split(" ")[1];
    const testToken = "HqSF37lXOneGzrMHsC9OaEdAEmFTl5zzJ5AKPXTaAAABjuaX3qJSGUcvaFb1Eg"

    const accessToken = await testService(testToken)

    return res.status(200).json({ accessToken: accessToken })
})

module.exports = {
    testController
}
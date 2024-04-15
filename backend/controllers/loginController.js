const { signInKakaoService } = require('../services')
const { asyncWrap } = require('../middlewares');

const signInKakao = asyncWrap(async (req, res) => {
    console.log("요청 접수")
    const headers = req.headers["authorization"]
    // const kakaoToken = headers.split(" ")[1];
    const kakaoToken = "token"

    const accessToken = await signInKakaoService(kakaoToken)

    return res.status(200).json({ accessToken: accessToken });
})

module.exports = {
    signInKakao
}
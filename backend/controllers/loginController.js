const { signInKakaoService } = require('../services')
const { asyncWrap } = require('../middlewares');

const signInKakao = asyncWrap(async (req, res) => {
    console.log("요청 접수")
    // const headers = req.headers["authorization"]
    // const kakaoToken = headers.split(" ")[1];
    console.log(req.body)
    const kakaoToken = req.body["access_token"]
    const kakaoName = req.body["profile_nickname"]

    const { access_token, refresh_token } = await signInKakaoService(kakaoToken, kakaoName)

    return res.status(200).json({access_token: access_token, refresh_token: refresh_token})
})

module.exports = {
    signInKakao
}
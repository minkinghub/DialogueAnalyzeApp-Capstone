const { signInKakaoService } = require('../services')
const { asyncWrap } = require('../middlewares');

const signInKakao = asyncWrap(async (req, res) => {
    if(req.body.access_token && req.body.access_token.startsWith('Bearer ')) {
        const kakaoToken = req.body.access_token.split(' ')[1]
        const kakaoName = req.body.profile_nickname

        const { access_token, refresh_token, isFirst } = await signInKakaoService(kakaoToken, kakaoName)

        return res.status(200).json({access_token: access_token, refresh_token: refresh_token, isFirst: isFirst})
    } else {
        return res.status(403).json({message: 'Invalid token'})
    }   
    
})

module.exports = {
    signInKakao,
}
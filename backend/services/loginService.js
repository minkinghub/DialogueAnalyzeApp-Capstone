const { findByKakaoId, kakaoModelSave } = require('../models')
const axios = require('axios');
const jwt = require('jsonwebtoken')

const signInKakaoService = async (kakaoToken, kakaoName) => {

    console.log(kakaoToken,kakaoName)

    const result = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: {
            Authorization: `Bearer ${kakaoToken}`
        }
    })

    const { data } = result
    const info = data.properties
    console.log('info :', info)
    if(!info) throw new Error("NO_USER_", 400)

    if(kakaoName == info.nickname) { // 검증, 이후 성별과 나이가 맞는지도 추가
        const isRegigster = await findByKakaoId(data.kakaoId)
        if(!isRegigster) {
            kakaoModelSave({
                kakaoId: data.kakaoId,
                gender: true,
                birth: new Date()
            })
        }

        const access_token = "확인용 임시 access 토큰"
        const refresh_token = "확인용 임시 refresh 토큰"
        
        return { access_token, refresh_token }
    }

    // const user = await getUserById(kakaoId); // DB에 있는지(이미 회원인지) 확인

    // if (!user) {
    //     await signUp(name);
    // }

    // return jwt.sign({ kakao_id: user[0].kakao_id }, process.env.TOKKENSECRET);

};

module.exports = {
    signInKakaoService
}
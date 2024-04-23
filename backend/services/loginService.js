const { findByKakaoId, userModelSave } = require('../models')
const { generateToken } = require('../configs')
const axios = require('axios');
const jwt = require('jsonwebtoken')

const signInKakaoService = async (kakaoToken, kakaoName) => {

    const result = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: {
            Authorization: `Bearer ${kakaoToken}`
        }
    })

    const { data } = result
    const info = data.properties
    if(!info) throw new Error("NO_USER_", 400)

    let userId

    if(kakaoName == info.nickname) { // 검증, 이후 성별과 나이가 맞는지도 추가
        const regigsterInfo = await findByKakaoId(data.kakaoId)

        if(!regigsterInfo) {
            userId = await userModelSave({
                name: "이름", // info.name
                nickname: info.nickname,
                email: "asdf1234@naver.com", // 카카오 api 갱신 시 카카오 이메일로 교체
                kakaoId: data.kakaoId,
                gender: true,
                birth: new Date()
            })
            userId = userId._id.toString()
        } else { 
            userId = regigsterInfo._id.toString()
        }
        
        const { access_token, refresh_token } = generateToken({id: userId})
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
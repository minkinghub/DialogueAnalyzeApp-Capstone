const { findByKakaoId, userModelSave } = require('../models')
const { generateToken } = require('../configs')
const axios = require('axios');

const signInKakaoService = async (kakaoToken, kakaoName) => {

    const result = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: {
            Authorization: `Bearer ${kakaoToken}`
        }
    })

    const { data } = result
    const info = data.properties
    const email = data.kakao_account.email

    if(!info || !email) throw new Error("NO_USER_", 400)

    let userId

    if(kakaoName == info.nickname) { // 검증, 이후 성별과 나이가 맞는지도 추가
        const regigsterInfo = await findByKakaoId(data.kakaoId)

        if(!regigsterInfo) {
            userId = await userModelSave({
                name: "이름", // info.name
                nickname: info.nickname,
                email: email,
                kakaoId: data.kakaoId,
                gender: true, // 사업자 번호 없어서, 성별과 생년월일 아니라서 받아야 넣어야됨
                birth: new Date()
            })
            userId = userId._id.toString()
        } else { 
            userId = regigsterInfo._id.toString()
        }
        
        const { access_token, refresh_token } = generateToken({userId: userId})
        return { access_token, refresh_token }
    }

}

module.exports = {
    signInKakaoService
}
const { findOneUserByKakaoId, userModelSave } = require('../models')
const { generateToken, encrypt, decrypt } = require('../configs')
const axios = require('axios');

const signInKakaoService = async (kakaoToken, kakaoName) => {

    const result = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: {
            Authorization: `Bearer ${kakaoToken}`
        }
    })

    const { data } = result
    const info = data.properties
    const kakaoId = data.id
    const encKakaoId = encrypt(String(kakaoId))

    const email = data.kakao_account.email || 'default@example.com';
    
    if(!info || !email) throw new Error("NO_USER_", 400)

    let userId
    let isFirst = true

    if(kakaoName == info.nickname) { // 검증, 이후 성별과 나이가 맞는지도 추가
        const regigsterInfo = await findOneUserByKakaoId(encKakaoId)
        if(!regigsterInfo) {
            console.log("유저 정보 없음")
            userId = await userModelSave({
                name: info.nickname, // 일단 닉네임으로 설정함
                nickname: info.nickname,
                email: encrypt(email),
                kakaoId: encKakaoId,
                gender: null,
                birth: null
            })
            userId = userId._id.toString()
        } else {
            console.log("유저 정보 있음")
            if(regigsterInfo.gender != null && regigsterInfo.birth != null) {
                console.log("기본 정보 있음")
                isFirst = false
            }
            userId = regigsterInfo._id.toString()
        }
        
        const { access_token, refresh_token } = generateToken({userId: userId})
        return { access_token, refresh_token, isFirst }
    }

}

module.exports = {
    signInKakaoService
}
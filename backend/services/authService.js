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
    
    const email = data.kakao_account.email
    const encEmail = encrypt(email)

    if(!info || !email) throw new Error("NO_USER_", 400)

    let userId
    let isFirst = false

    if(kakaoName == info.nickname) { // 검증, 이후 성별과 나이가 맞는지도 추가
        const regigsterInfo = await findOneUserByKakaoId(kakaoId)
        if(!regigsterInfo) {
            userId = await userModelSave({
                name: info.nickname, // 일단 닉네임으로 설정함
                nickname: info.nickname,
                email: encEmail,
                kakaoId: encKakaoId,
                gender: null,
                birth: null
            })
            userId = userId._id.toString()
        } else { 
            if(regigsterInfo.gender != null && regigsterInfo.birth != null) {
                isFirst = true 
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
const { getUserById, signUp } = require('../models')
const axios = require('axios');
const jwt = require('jsonwebtoken')

const signInKakaoService = async (kakaoToken) => {

    const result = await axios.get("https://kapi.kakao.com/v2/user/me", {
    headers: {
        Authorization: `Bearer ${kakaoToken}`
    }
    })

    const { data } = result
    const name = data.properties
    console.log(result)

    // if (!name) throw new Error("KEY_ERROR", 400);

    // const user = await getUserById(kakaoId);

    // if (!user) {
    //     await signUp(name);
    // }

    // return jwt.sign({ kakao_id: user[0].kakao_id }, process.env.TOKKENSECRET);

};

module.exports = {
    signInKakaoService
}
const { testModelSave } = require('../models')
const axios = require('axios');

const testService = async (testToken) => {
    // const result = await axios.get("https://kapi.kakao.com/v2/user/me", {
    // headers: {
    //     Authorization: `Bearer ${testToken}`
    // }
    // })

    // const { data } = result
    // const name = data.properties
    // console.log("name : ", name.nickname)
    // await testModelSave({
    //     name: name.nickname,
    //     gender: true,
    //     birth: new Date('1999-03-02T00:00:00Z'),
    //     signType: 1
    // })

    
};

module.exports = {
    testService
}
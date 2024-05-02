const { userModelSave } = require('../models');
const { userModelUpdate } = require('../models');

// const logoutService = async (access_token, refresh_token) => {

//     let status = true
//     if(decoded.status) { // 유저 정보 살아 있음
//         status = await removeToken(decoded.userId)
//     } // 검증 안되면 이미 만료된거

//     return status
// }

const updateUserService = async (userId, gender, birth) => {
    const gen = gender.toLowerCase() === 'true'
    const bir = new Date(birth)
    const data = {
        gender: gen,
        birth: bir
    }
    const result = await userModelUpdate(userId, data)
    return result.status
}

module.exports = {
    // logoutService,
    updateUserService
}
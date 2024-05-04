const { userModelSave, findOneHistoryByChatId, findHistoryByUserId } = require('../models');
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

const sendHistoryDetailService = async (userId, historyKey) => {
    const history = await findOneHistoryByChatId(historyKey)

    if(history.userId.toString() == userId) {
        history.userId == null // userId 값이 객체에서 안지워진다, 추후 수정 필요
        return history
    }
    else return null
}

const sendHistoryListService = async (userId) => {
    const historyList = await findHistoryByUserId(userId)

    return historyList
}

module.exports = {
    // logoutService,
    updateUserService,
    sendHistoryDetailService,
    sendHistoryListService
}
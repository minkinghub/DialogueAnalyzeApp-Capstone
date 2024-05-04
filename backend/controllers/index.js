const { signInKakao } = require('./authController')
const { testController } = require('./testController')
const { analyzeText } = require('./chatController')
const { logout, updateUser, sendHistoryList, sendHistoryDetail } = require('./userController')

module.exports = {
    signInKakao,
    testController,
    analyzeText,
    logout,
    updateUser,
    sendHistoryList,
    sendHistoryDetail
}
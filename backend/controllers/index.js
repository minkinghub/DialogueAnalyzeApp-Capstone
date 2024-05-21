const { signInKakao } = require('./authController')
const { testController } = require('./testController')
const { analyzeText, GPUserverOpen, GPUserverClose } = require('./chatController')
const { logout, updateUser, sendHistoryList, sendHistoryDetail } = require('./userController')

module.exports = {
    signInKakao,
    testController,
    analyzeText,
    GPUserverOpen,
    GPUserverClose,
    logout,
    updateUser,
    sendHistoryList,
    sendHistoryDetail
}
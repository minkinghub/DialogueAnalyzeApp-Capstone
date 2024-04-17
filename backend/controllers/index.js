const { signInKakao } = require('./loginController')
const { testController } = require('./testController')
const { analyzeText } = require('./chatController');

module.exports = {
    signInKakao,
    testController,
    analyzeText
}
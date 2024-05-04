const { removeToken } = require('../configs');
const { asyncWrap } = require('../middlewares');
const { updateUserService, sendHistoryDetailService, sendHistoryListService } = require('../services');

const logout = asyncWrap(async (req, res) => {
    const userId = req.user.userId
    const status = await removeToken(userId)

    return res.status(200).json({status: status})
})

const updateUser = asyncWrap(async (req, res) => {
    const userId = req.user.userId
    const gender = req.body.gender
    const birth = req.body.birth

    const result = await updateUserService(userId, gender, birth)
    return res.status(200).json({status: result})
})

const sendHistoryList = asyncWrap(async (req, res) => {
    const userId = req.user.userId

    const result = await sendHistoryListService(userId)
    if(result == null) return res.status(400).send("권한 없음")
    else return res.status(200).send(result)
})

const sendHistoryDetail = asyncWrap(async (req, res) => {
    const userId = req.user.userId
    const historyKey = req.body.historyKey

    const result = await sendHistoryDetailService(userId, historyKey)
    if(result == null) return res.status(400).send("권한 없음")
    else return res.status(200).send(result)
})

module.exports = {
    logout,
    updateUser,
    sendHistoryList,
    sendHistoryDetail
}
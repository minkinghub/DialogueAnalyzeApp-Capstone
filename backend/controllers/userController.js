const { removeToken } = require('../configs');
const { asyncWrap } = require('../middlewares');
const { updateUserService } = require('../services');

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

module.exports = {
    logout,
    updateUser
}
const { removeToken } = require('../configs');
const { asyncWrap } = require('../middlewares');

const logout = asyncWrap(async (req, res) => {
    const userId = req.userId

    const status = await removeToken(userId)

    return res.status(200).json({status: status})
})

module.exports = {
    logout
}
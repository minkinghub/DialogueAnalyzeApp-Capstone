const { testService } = require('../services')
const { asyncWrap } = require('../middlewares');
const { findOneUserByObjectId } = require('../models');

const testController = asyncWrap(async (req, res) => {
    console.log("테스트 요청 접수")
    // const userId = '662cd80b5ac8aacde3abbc84'
    // const userData = await findUserByObjectId(userId)
    // console.log(userData);
    // const { access_token, refresh_token } = await generateToken({userId: userId});

    // return res.status(200).json({ access_token: access_token })
    return res.status(200).json({massage: "test"})
})

module.exports = {
    testController
}
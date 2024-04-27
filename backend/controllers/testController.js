const { testService } = require('../services')
const { asyncWrap } = require('../middlewares');

const testController = asyncWrap(async (req, res) => {
    
})

module.exports = {
    testController
}
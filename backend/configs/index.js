const { connectToMongoDB } = require('./mongo')
const { redisClient } = require('./redis')

module.exports = {
    connectToMongoDB,
    redisClient
}
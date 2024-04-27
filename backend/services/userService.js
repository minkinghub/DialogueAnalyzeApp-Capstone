const { removeToken, verifyToken } = require('../configs')
const jwt = require('jsonwebtoken');

const logoutService = async (access_token, refresh_token) => {
    const decoded = await verifyToken(refresh_token)
    let status = true
    if(decoded.status) { // 유저 정보 살아 있음
        status = await removeToken(decoded.userId)
    } // 검증 안되면 이미 만료된거

    return status
}

module.exports = {
    logoutService
}
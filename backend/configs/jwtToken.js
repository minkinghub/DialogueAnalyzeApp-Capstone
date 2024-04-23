require('dotenv').config();
const jwt = require('jsonwebtoken')
const redis = require('redis')

const redisClient = redis.createClient({
    host : process.env.REDIS_HOST,
    port : process.env.REDIS_PORT
})

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

const JWT_SECRET = process.env.JWT_SECRET_KEY

function generateToken(payload) {
    const access_token = jwt.sign(payload, JWT_SECRET, {expiresIn: '15m'})
    const refresh_token = jwt.sign(payload, JWT_SECRET, {expiresIn: '14d'})

    // Redis에 토큰 저장 및 만료 시간 설정
    redisClient.set(access_token, 'valid', { EX: 15 * 60 })  // 15분
        .catch(err => console.error('액세스 토큰을 Redis에 저장하는데 실패했습니다:', err));
    redisClient.set(refresh_token, 'valid', { EX: 14 * 24 * 60 * 60 })  // 14일
        .catch(err => console.error('리프레시 토큰을 Redis에 저장하는데 실패했습니다:', err));

    return { access_token, refresh_token }
}

function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
}

async function refreshAccessToken(refreshToken) {
    // Redis에서 refresh_token의 만료 시간 확인
    const refreshTokenExists = await new Promise((resolve, reject) => {
        redisClient.exists(refreshToken, (err, exists) => {
            if (err) {
                reject(err);
            } else {
                resolve(exists);
            }
        });
    });

    if (!refreshTokenExists) {
        throw new Error('Refresh token expired or not found');
    }

    // refresh_token이 유효하면 새로운 access_token 생성
    const decoded = await verifyToken(refreshToken);
    const newAccessToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: '15m' });

    // Redis에 새로운 access_token 저장
    redisClient.set(newAccessToken, 15 * 60, 'valid', { EX: 15 * 60 });

    return newAccessToken;
}

module.exports = {
    generateToken,
    verifyToken,
    refreshAccessToken
}
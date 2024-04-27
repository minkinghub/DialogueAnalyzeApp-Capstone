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
    const userId = payload.userId
    const access_token = jwt.sign(payload, JWT_SECRET, {expiresIn: '15m'})
    const refresh_token = jwt.sign(payload, JWT_SECRET, {expiresIn: '14d'})

    // Redis에 토큰 저장 및 만료 시간 설정
    redisClient.set(`${userId}:access_token`, 'valid', { EX : 15 * 60})  // 14일
        .then(() => console.log(`access_token Redis에 저장 성공\nkey: ${userId}:access_token`))
        .catch(err => console.error('access_token Redis에 저장 실패', err))

    // Redis에 토큰 저장 및 만료 시간 설정
    redisClient.set(`${userId}:refresh_token`, 'valid', { EX: 14 * 24 * 60 * 60 })  // 14일
        .then(() => console.log(`refresh_token Redis에 저장 성공\nkey: ${userId}:refresh_token`))
        .catch(err => console.error('refresh_token Redis에 저장 실패', err))

    return { access_token, refresh_token }
}

async function removeToken(userId) {
    redisClient.del(`${userId}:access_token`)
    redisClient.del(`${userId}:refresh_token`)

    return true
}

async function verifyToken(token) {
    try {
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });

        const key = `${decoded.userId}:access_token`;
        console.log(`key: ${key}`)
        const tokenExists = await redisClient.get(key);
        
        return { status : tokenExists !== null, userId: decoded.userId };
    } catch (err) {
        return { status : false, userId: null}
    }
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
    removeToken,
    verifyToken,
    refreshAccessToken
}
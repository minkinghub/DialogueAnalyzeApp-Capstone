const { verifyToken } = require('../configs')

const checkAuth = async (req, res, next) => {
    if (req.path.startsWith('/api/auth') || req.path.startsWith('/api/test')) { // 로그인이나 회원가입은 토큰 없음
        return next();  
    }

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        const token = req.headers.authorization.split(' ')[1]
        const result = await verifyToken(token) // 함수 자체에서 에러 핸들링 했음
        if(result.status) {
            req.user = {
                userId: result.userId
            };
            next()
        } else {
            return res.status(403).send({message: "Expired token"})
        }
        
    } else {
        return res.status(401).send({message: "Invalid token."})
    }
};

module.exports = {
    checkAuth
}
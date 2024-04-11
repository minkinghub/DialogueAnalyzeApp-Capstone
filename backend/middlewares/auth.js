const { UserModel } = require('../models/User');

const auth = async (req, res, next) => {

    if (!req.session || !req.session.user) {
        return res.status(401).json({ isAuth: false, message: '로그인이 필요합니다.' });
    }

    const userId = req.session.user.userId;

    try {
        const user = await UserModel.findById(userId);
        console.log(userId);
        if (!user) {
            req.isAuth = false;
            return res.status(400).json({ isAuth: false, message: '유효하지 않은 사용자입니다.' });
        }

        req.isAuth = true;
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = auth;
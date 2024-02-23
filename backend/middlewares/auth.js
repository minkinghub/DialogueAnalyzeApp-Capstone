const { User } = require('../models/User');

const auth = async (req, res, next) => {
    const userId = req.session.user.userId;
    const role = req.session.user.role;

    if (!userId) {
        return res.status(401).json({ isAuth: false, message: '로그인이 필요합니다.' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ isAuth: false, message: '유효하지 않은 사용자입니다.' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = auth;

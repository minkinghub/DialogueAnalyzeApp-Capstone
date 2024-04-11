const express = require('express');
const router = express.Router();
const { UserModel } = require('../../models/User');
const auth = require('../../middlewares/auth');

// 로그아웃
// 경로: "http://localhost:3000/api/users/logout"
router.get('/', auth, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.json({ success: false, err });
        }

        // 세션이 성공적으로 삭제되면 클라이언트에 응답
        res.status(200).send({ success: true });
    });
});

module.exports = router;
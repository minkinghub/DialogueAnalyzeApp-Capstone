const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

// 회원 분류(비회원, 회원, 관리자)
// 경로: "http://localhost:3000/api/users/auth"
router.get("/", auth, (req, res) => {
    // 일단 로그인은 성공하셨으니 비회원은 아님
    res.status(200).json({
        _id: req.user._id,
        // 0이면 일반유저, 아니면 관리자
        isAdmin: req.user.role !== 0,
        isAuth: true,
        id: req.user.id,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
    });
});

module.exports = router;
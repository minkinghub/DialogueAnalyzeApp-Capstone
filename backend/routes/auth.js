const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

// 회원 분류(비회원, 회원, 관리자)
// 경로: "http://localhost:3000/api/users/auth"
router.get("/", auth, (req, res) => {
    if (req.isAuth) {
        // 로그인 상태인 경우
        res.status(200).json({
            //_id: req.user._id,
            isAdmin: req.user.role !== 0,
            isAuth: true,
            //id: req.user.id,
            //name: req.user.name,
            //lastname: req.user.lastname,
            // 0이면 일반유저, 아니면 관리자
            role: req.user.role,
            //image: req.user.image,
        });
    } else {
        // 로그인 상태가 아닐 경우
        res.status(200).json({
            isAuth: false,
        });
    }
    
});

module.exports = router;
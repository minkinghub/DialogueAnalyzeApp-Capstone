const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require('../models/User');

// 로그인
// 경로: "http://localhost:3000/api/users/login"
router.post("/", async (req, res) => {
    // 1. 요청된 이메일id가 DB에 존재하는 지 확인
    try {
      const user = await User.findOne({ id: req.body.id });
      if (!user) {
        return res.json({
          loginSuccess: false,
          message: "아이디(이메일)에 해당하는 유저가 없습니다.",
        });
      }
      // 2. 이메일ID 존재 시, 비밀번호 일치하는 지 확인
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });
      }
  
      // 3. 비밀번호 일치 시, 세션 생성
      req.session.user = {
        userId: user._id,
        role: user.role
      };

      res.status(200).json({ loginSuccess: true, userId: user._id });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;
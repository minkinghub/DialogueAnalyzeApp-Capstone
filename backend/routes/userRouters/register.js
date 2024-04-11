const express = require('express');
const router = express.Router();
const { UserModel } = require('../../models/User');
const mongoose = require('mongoose');

// 회원가입
// 경로: "http://localhost:3000/api/users/register"
/* PostMan 기준 이렇게 보내면 됨(Post로, 이메일 중복 검사 O, 비밀번호 해쉬화 O)
{
  "id": "test@a.com",
  "password": "12345678",
  "birthday": 20000101,
  "gender": "man",
  "name": "hoy"
} */
router.post("/", async (req, res) => {
    const user = new UserModel(req.body);
    console.log("현재 user 값: ", user);
  
    try {
      await user.validate(); // 스키마에 맞는지 검사
      await user.save(); // 비밀번호 해쉬화 작업, 필수임
      const db = mongoose.connection.useDb('users');
      const collection = db.collection('users');
      await collection.insertOne(user);
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

module.exports = router;
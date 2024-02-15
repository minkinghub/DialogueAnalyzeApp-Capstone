const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const auth = require('../middlewares/auth');
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');

// 앞에 공통으로 http://localhost:3000/api/users 붙어요
// 회원가입
router.post("/register", async (req, res) => {
    const user = new User(req.body);
    console.log("현재 user 값: ", user);

    try {
        await user.save();
        const db = mongoose.connection.useDb('users');
        const collection = db.collection('users');
        await collection.insertOne(user);
        return res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, err });
    }
});



//로그인
router.post("/login", async (req, res) => {
  // 1. 요청된 이메일이 DB에 존재하는 지 확인
  try {
    // users DB에 users 컬렉션에 접근
    const db = mongoose.connection.useDb('users');
    const collection = db.collection('users');

    const user = await collection.findOne({ id: req.body.id });
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "아이디(이메일)에 해당하는 유저가 없습니다.",
      });
    }
    // 2. 이메일 존재 시, 비밀번호 일치하는 지 확인
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.json({
        loginSuccess: false,
        message: "비밀번호가 틀렸습니다.",
      });
    }

    // 3. 비밀번호도 일치하면 토큰 생성
    const userWithToken = await new Promise((resolve, reject) => {
      user.generateToken((err, user) => {
        if (err) reject(err);
        resolve(user);
      });
    });

    //토큰을 저장한다. where? 쿠키 OR 로컬 스토리지 OR 세션스토리지
    //쿠키 name : value
    res
      .cookie("x_auth", userWithToken.token)
      .status(200)
      .json({ loginSuccess: true, userId: userWithToken._id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// 회원 분류(비회원, 회원, 관리자)
router.get("/auth", auth, (req, res) => {
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

// 로그아웃
router.get("/logout", auth, (req, res) => {
    // users DB와 users 컬렉션에 접근
    const db = mongoose.connection.useDb('users');
    const collection = db.collection('users');
    collection.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({ success: true });
    });
});

module.exports = router;
const express = require('express');
const router = express.Router();

// 회원가입
router.post("/api/users/register", async (req, res) => {

    const user = new User(req.body);
    console.log("현재 user 값: ", user);
  
    try {
      const db = mongoose.connection.useDb('users');
      const collection = db.collection('users');
      await collection.insertOne(user);
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, err });
    }
  });
const express = require('express');
const router = express.Router();
const { CommentModel } = require('../../models/Comment');
const mongoose = require('mongoose');

// 댓글을 저장하는 api
// 경로: "http://localhost:3000/api/post/comment"
router.post("/", async (req, res) => {
    const comment = new CommentModel(req.body);
    console.log("현재 comment 값: ", comment);

    try {
        await comment.validate();

        const db = mongoose.connection.useDb('comment');
        const collection = db.collection('comment');
        await collection.insertOne(comment);
        console.log("comment가 성공적으로 저장되었습니다.");
        res.status(200).send("comment가 성공적으로 저장되었습니다.");
    } catch (err) {
        console.error(err);
        res.status(500).send("comment 저장에 실패했습니다.");
    }
});

module.exports = router;
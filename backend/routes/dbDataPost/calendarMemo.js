const express = require('express');
const router = express.Router();
const { CalendarModel } = require('../../models/Calendar');
const mongoose = require('mongoose');
const auth = require('../../middlewares/auth');

// 캘린더에 메모를 저장하는 api
// 경로: "http://localhost:3000/api/post/calendarMemo"
router.post("/", auth, async (req, res) => {
    console.log("하하하하하ㅏ하하하하하");
    console.log("user의 _id값: ", req.user._id);
    const calendarMemo = new CalendarModel({
        ...req.body,
        uid: req.user._id
    });
    console.log("현재 calendarMemo 값: ", calendarMemo);

    try {
        await calendarMemo.validate();
        
        const db = mongoose.connection.useDb('calendar');
        const collection = db.collection('calendar');
        await collection.insertOne(calendarMemo);
        console.log("calendarMemo가 성공적으로 저장되었습니다.");
        res.status(200).send("calendarMemo가 성공적으로 저장되었습니다.");
    } catch (err) {
        console.error(err);
        res.status(500).send("calendarMemo 저장에 실패했습니다.");
    }
});

module.exports = router;
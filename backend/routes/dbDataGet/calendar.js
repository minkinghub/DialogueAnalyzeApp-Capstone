const express = require('express');
const router = express.Router();

// 캘린더에서 데이터를 get하는 코드
// 경로: "http://localhost:3000/api/get/calendar?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD"
// 예를 들어, "http://localhost:3000/api/get/calendar?startDate=2024-01-01&endDate=2024-12-31"는 2024년 1월 1일부터 2024년 12월 31일까지의 데이터를 가져옴
router.get("/", (req, res) => {
    const { startDate, endDate } = req.query;

    // mongoDB에서 calendar.calendar의 특정 날짜 사이의 모든 데이터 가져오기
    CalendarModel.find({ date: { $gte: startDate, $lte: endDate } }, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("calendar 데이터를 가져오는데 실패했습니다.");
        } else {
            console.log("calendar 데이터를 성공적으로 가져왔습니다.");
            res.status(200).send(data);
        }
    });
});

module.exports = router;
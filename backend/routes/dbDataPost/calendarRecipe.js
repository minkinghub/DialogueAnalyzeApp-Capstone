const express = require('express');
const router = express.Router();
const { CalendarModel } = require('../../models/Calendar');
const mongoose = require('mongoose');
 
// 캘린더? 에? 레시피? api? 
// 경로: "http://localhost:3000/api/post/calendarRecipe"
router.post("/", async (req, res) => {
    const calendarRecipe = new CalendarModel(req.body);
    console.log(calendarRecipe);

    try {
        await calendarRecipe.validate();
        
        const db = mongoose.connection.useDb('calendar');
        const collection = db.collection('calendar');
        await collection.insertOne(calendarRecipe);
        console.log("calendarRecipe가 성공적으로 저장되었습니다.");
        res.status(200).send("calendarRecipe가 성공적으로 저장되었습니다.");
    } catch (err) {
        console.error(err);
        res.status(500).send("calendarRecipe 저장에 실패했습니다.");
    }
});

module.exports = router;
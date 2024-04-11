const express = require('express');
const router = express.Router();
const { NutrientModel } = require('../../models/Nutrient');
const mongoose = require('mongoose');

// 영양소? 를? 저장? api?
// 경로: "http://localhost:3000/api/post/nutrient"
router.post("/", async (req, res) => {
    const nutrient = new NutrientModel(req.body);
    console.log("현재 nutrient값: ", nutrient);

    try {
        await nutrient.validate();

        const db = mongoose.connection.useDb('nutrient');
        const collection = db.collection('nutrient');
        await collection.insertOne(nutrient);
        console.log("nutrient가 성공적으로 저장되었습니다.");
        res.status(200).send("nutrient가 성공적으로 저장되었습니다.");
    } catch (err) {
        console.error(err);
        res.status(500).send("nutrient 저장에 실패했습니다.");
    }
});

module.exports = router;
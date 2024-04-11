const express = require('express');
const router = express.Router();
const { UserRecipeModel } = require("../../models/UserRecipe")
const mongoose = require('mongoose');

// 레시피? 를? 저장? api?
// 경로: "http://localhost:3000/api/post/recipe"
router.post("/", async (req, res) => {
    const recipe = new UserRecipeModel(req.body);
    console.log("현재 recipe 값: ", recipe);

    try {
        await recipe.validate();

        const db = mongoose.connection.useDb('recipe');
        const collection = db.collection('recipe');
        await collection.insertOne(recipe);
        console.log("recipe가 성공적으로 저장되었습니다.");
        res.status(200).send("recipe가 성공적으로 저장되었습니다.");
    } catch (err) {
        console.error(err);
        res.status(500).send("recipe 저장에 실패했습니다.");
    }
    
});

module.exports = router;
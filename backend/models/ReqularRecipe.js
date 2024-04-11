// mongoDB에 reqularRecipe.reqularRecipe에 스키마를 정의하는 코드

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReqularRecipeSchema = Schema({
    /*reqularRecipeId: {
        type: String,
        required: true
    },*/
    recipeName: {
        type: String,
        required: true
    },
    ingredients: {
        type: String,
        required: true
    },
    images: {
        type: String,
        required: true
    },
    contents: {
        type: String,
        required: true
    },
    tags: {
        type: String,
        required: true
    },
    calorie: {
        type: String,
        required: true
    },
    carbohydrate: {
        type: String,
        required: true
    },
    protein: {
        type: String,
        required: true
    },
    fat: {
        type: String,
        required: true
    },
    sodium: {
        type: String,
        required: true
    },
});

const ReqularRecipeModel = mongoose.model("reqularRecipe", ReqularRecipeSchema);

module.exports = { ReqularRecipeModel };
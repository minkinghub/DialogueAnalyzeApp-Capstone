// mongoDB에 UserRecipe.UserRecipe에 스키마를 정의하는 코드

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserRecipeSchema = Schema({
    // userRecipeId: { type: String, required: true },
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
    nickname: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    scores: {
        type: Number,
        required: true
    },
    totalScore: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        required: true
    },
    comments: {
        type: Array,
        required: true
    }

});

const UserRecipeModel = mongoose.model('UserRecipe', UserRecipeSchema, 'UserRecipe');

module.exports = { UserRecipeModel };
// mongoDB에 nutrient.nutrient에 스키마를 정의하는 코드

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 스키마 정의
const NutrientSchema = Schema({
    //nid: { type: Number, required: true }
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    calorie: {
        type: Number,
        required: true
    },
    carbohydrate: {
        type: Number,
        required: true
    },
    protein: {
        type: Number,
        required: true
    },
    fat: {
        type: Number,
        required: true
    },
    sodium: {
        type: Number,
        required: true
    },
});

// nutrient.nutrient에 접근
const NutrientModel = mongoose.model('nutrient', NutrientSchema);

module.exports = { NutrientModel };
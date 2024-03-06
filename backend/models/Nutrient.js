// mongoDB에 nutrients.nutrients에 스키마를 정의하는 코드

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 스키마 정의
const NutrientSchema = new Schema({
    nid: Number, // 자동으로 늘어나는 넘버링
    age: Number,
    gender: String,
    calorie: Number,
    carbohydrate: Number,
    protein: Number,
    fat: Number,
    sodium: Number,
});

// 'nutrients' DB와 'nutrients_id' 컬렉션에 영양소 정보 저장
const NutrientModel = mongoose.model('nutrient', NutrientSchema, 'nutrients');

module.exports = NutrientModel;
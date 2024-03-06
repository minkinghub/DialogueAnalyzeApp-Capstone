// mongoDB에 ingredients.ingredients에 스키마를 정의하는는 코드

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 스키마 정의
const IngredientSchema = new Schema({
    nid: Number, // 자동으로 늘어나는 넘버링
    calorie: Number,
    carbohydrate: Number,
    protein: Number,
    fat: Number,
    sodium: Number,
    g: Number,
});

// 'ingredients' DB와 'ingredients_id' 컬렉션에 재료 정보 저장
const IngredientModel = mongoose.model('ingredient', IngredientSchema, 'ingredients');

module.exports = IngredientModel;
// mongoDB에 ingredient.ingredient에 스키마를 정의하는는 코드

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 스키마 정의
const IngredientSchema = Schema({
    //ingredient_id: String, // 컬렉션
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
    g: {
        type: Number,
        required: true
    }
});

// ingredient.ingredient에 접근
const IngredientModel = mongoose.model('ingredient', IngredientSchema);

module.exports = { IngredientModel };
// mongoDB에 images.recipe에 image url을 저장할 코드

const mongoose = require('mongoose');

// 스키마 정의
const RecipeSchema = new mongoose.Schema({
    imageUrl: String, // 이미지 url
    imageId: Number, // 자동으로 늘어나는 넘버링
});

// 'images' DB와 'recipe' 컬렉션에 이미지 url 저장
const RecipeModel = mongoose.model('recipe', RecipeSchema, 'recipe');

module.exports = RecipeModel;

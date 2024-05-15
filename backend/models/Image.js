// mongoDB에 images.recipe에 스키마를 정의하는 코드

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 스키마 정의
const ImageUploadSchema = Schema({
    imageUrl: String, // 이미지 url
    imageId: Number, // 자동으로 늘어나는 넘버링
});

// 'images' DB와 'recipe' 컬렉션에 이미지 url 저장
const ImageUploadModel = mongoose.model('recipe', ImageUploadSchema, 'recipe');

module.exports = { ImageUploadModel };

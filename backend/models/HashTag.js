// mongoDB에 HashTag.HashTag에 스키마를 정의하는 코드

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HashTagSchema = new Schema({
    recipeId: {
        type: String,
        required: true
    },
    hashTag: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('HashTag', HashTagSchema);
// mongoDB에 ReqularRecipes.ReqularRecipes에 스키마를 정의하는 코드

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReqularRecipeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    ingredients: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    href: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('ReqularRecipes', ReqularRecipeSchema);
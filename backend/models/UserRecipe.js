// mongoDB에 UserRecipe.UserRecipe에 스키마를 정의하는 코드

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserRecipeSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    recipeId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('UserRecipe', UserRecipeSchema);
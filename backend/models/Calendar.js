// mongoDB에 calendar.calendar에 스키마를 정의하는 코드

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CalendarSchema = new Schema({
    date: {
        type: String,
        required: true
    },
    meal: {
        type: String,
        required: true
    },
    recipeId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('calendar', CalendarSchema);
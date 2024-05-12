// mongoDB에 calendar.calendar에 스키마를 정의하는 코드

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CalendarSchema = Schema({
    uid: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    morning: {
        type: String
    },
    lunch: {
        type: String
    },
    dinner: {
        type: String
    },
    snack: {
        type: String
    },
    memo: {
        type: String
    }
});

const CalendarModel = mongoose.model('calendar', CalendarSchema);

module.exports = { CalendarModel };
// mongoDB에 hashTag.hashTag에 스키마를 정의하는 코드

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HashTagSchema = Schema({
    /*tagId: {
        type: String,
        required: true
    },*/
    hashTag: {
        type: String,
        required: true
    }
});

const HashTagModel = mongoose.model('hashTag', HashTagSchema);

module.exports = { HashTagModel };
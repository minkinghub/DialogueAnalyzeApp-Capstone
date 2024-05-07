// mongoDB에 comment.comment에 스키마를 정의하는 코드

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = Schema({
    /*comment_id: {
        type: String,
        required: true
    },*/
    nickname: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const CommentModel = mongoose.model('comment', CommentSchema);

module.exports = { CommentModel };
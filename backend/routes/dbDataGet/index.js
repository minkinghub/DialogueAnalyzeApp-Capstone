const express = require('express');
const router = express.Router();

const calendarRouter = require('./calendar');
const commentRouter = require('./comment');
const postRouter = require('./post');
const reqularRouter = require('./reqular');
const userRouter = require('./user');

router.use('/calendar', calendarRouter);
router.use('/comment', commentRouter);
router.use('/post', postRouter);
router.use('/reqular', reqularRouter);
router.use('/user', userRouter);

module.exports = router;
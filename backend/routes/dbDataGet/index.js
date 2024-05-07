const express = require('express');
const router = express.Router();

const calendarRouter = require('./calendar');
const commentRouter = require('./comment');
const postRouter = require('./post');
const reqularRecipeRouter = require('./reqularRecipe');
const userRecipeRouter = require('./userRecipe');

router.use('/calendar', calendarRouter);
router.use('/comment', commentRouter);
router.use('/post', postRouter);
router.use('/reqular', reqularRecipeRouter);
router.use('/user', userRecipeRouter);

module.exports = router;
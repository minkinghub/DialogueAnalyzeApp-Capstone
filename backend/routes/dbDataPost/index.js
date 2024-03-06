const express = require('express');
const router = express.Router();

const calendarRecipeRouter = require('./calendarRecipe');
const calendarMemoRouter = require('./calendarMemo');
const commentRouter = require('./comment');
const nutritionRouter = require('./nutrition');
const recipeRouter = require('./recipe');

router.use('/calendarRecipe', calendarRecipeRouter);
router.use('/calendarMemo', calendarMemoRouter);
router.use('/comment', commentRouter);
router.use('/nutrition', nutritionRouter);
router.use('/recipe', recipeRouter);

module.exports = router;
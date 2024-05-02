const express = require('express');
const { testController } = require('../controllers');
const router = express.Router();

router.post('/post', testController) // /api/test/post
router.get('/get') // /api/test/get

module.exports = router
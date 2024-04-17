const express = require('express');
const router = express.Router();

const kakaoRouter = require('./loginRouter')
const testRouter = require('./testRouter')
const chatRouter = require('./chatRouter')

router.use('/auth', kakaoRouter) // /api/auth
router.use('/upload', chatRouter) // /api/upload
router.use('/test', testRouter) // /api/test

module.exports = router
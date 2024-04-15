const express = require('express');
const router = express.Router();

const kakaoRouter = require('./loginRouter')
const testRouter = require('./testRouter')

router.use('/auth', kakaoRouter) // /api/auth
router.use('/test', testRouter) // /api/test

module.exports = router
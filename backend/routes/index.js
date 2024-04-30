const express = require('express');
const router = express.Router();

const kakaoRouter = require('./authRouter')
const testRouter = require('./testRouter')
const chatRouter = require('./chatRouter')
const userRouter = require('./userRouter')

router.use('/auth', kakaoRouter) // /api/auth
router.use('/upload', chatRouter) // /api/upload
router.use('/test', testRouter) // /api/test
router.use('/user', userRouter) // /api/user

module.exports = router
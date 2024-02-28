const express = require('express');
const router = express.Router();

const registerRouter = require('./register');
const loginRouter = require('./login');
const authRouter = require('./auth');
const logoutRouter = require('./logout');
const idCheckRouter = require('./idCheck');

router.use('/register', registerRouter);
router.use('/login', loginRouter);
router.use('/auth', authRouter);
router.use('/logout', logoutRouter);
router.use('/idCheck', idCheckRouter);

module.exports = router;
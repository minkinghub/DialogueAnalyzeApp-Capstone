const express = require('express');
const router = express.Router();

const registerRouter = require('./register');
const loginRouter = require('./login');
const authRouter = require('./auth'); //
const logoutRouter = require('./logout');
const idCheckRouter = require('./idCheck');
const nameCheckRouter = require('./nameCheck');
const emailRouter = require('./email'); //
const emailAuthRouter = require('./emailAuth'); //
const resetPassRouter = require('./resetPass');
const changePassRouter = require('./changePass'); //

router.use('/register', registerRouter);
router.use('/login', loginRouter);
router.use('/auth', authRouter);
router.use('/logout', logoutRouter);
router.use('/idCheck', idCheckRouter);
router.use('/nameCheck', nameCheckRouter);
router.use('/email', emailRouter);
router.use('/emailAuth', emailAuthRouter);
router.use('/resetPass', resetPassRouter);
router.use('/changePass', changePassRouter);

module.exports = router;
const express = require('express');
const router = express.Router();

const { signInKakao } = require("../controllers");

router.post('/login/kakao', signInKakao) // /api/auth/login/kakao
router.post('/login/general', ) // /api/auth/login/general
router.post('/signup/general', ) // api/auth/signup/general

module.exports = router
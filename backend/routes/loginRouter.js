const express = require('express');
const router = express.Router();
const { signInKakao } = require("../controllers");

router.post('/login/kakao', signInKakao) // /api/auth/login/kakao
router.post('/signin/general', ) // /api/auth/signin/general

module.exports = router
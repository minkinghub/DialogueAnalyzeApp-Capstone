const express = require('express');
const router = express.Router();
const { signInKakao } = require("../controllers");

router.post('/signin/kakao', signInKakao) // /api/auth/signin/kakao
router.post('/signin/general', ) // /api/auth/signin/general

module.exports = router
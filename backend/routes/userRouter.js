const express = require('express');
const router = express.Router();
const { logout } = require('../controllers')

router.post('/logout', logout) // /api/user/logout

module.exports = router
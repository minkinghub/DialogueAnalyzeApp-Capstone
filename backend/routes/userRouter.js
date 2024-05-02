const express = require('express');
const router = express.Router();
const { logout, updateUser } = require('../controllers')

router.post('/logout', logout) // /api/user/logout
router.post('/update', updateUser) // /api/user/update

module.exports = router
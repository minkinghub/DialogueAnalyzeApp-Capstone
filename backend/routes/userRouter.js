const express = require('express');
const router = express.Router();
const { logout, updateUser, sendHistoryList, sendHistoryDetail } = require('../controllers')

router.post('/logout', logout) // /api/user/logout
router.post('/update', updateUser) // /api/user/update
router.post('/history/list', sendHistoryList) // /api/user/history/list
router.post('/history/detail', sendHistoryDetail) // /api/user/history/detail

module.exports = router
const express = require('express');
const router = express.Router();
const crypto = require('crypto');

router.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if(username == 'admin' && password == '1234') {
        sharedKey = crypto.randomBytes(32).toString('hex');
        console.log("세션 키 : ", sharedKey);
        req.session.user = { sharedKey };
        res.json({ message: '로그인 성공' });
    } else {
        res.status(401).json({ message: '인증 실패' });
    }
});

module.exports = router;
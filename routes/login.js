const express = require('express');
const router = express.Router();

router.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if(username == 'admin' && password == '1234') {
        req.session.user = { username };
        res.json({ message: '로그인 성공' });
    } else {
        res.status(401).json({ message: '인증 실패' });
    }
});

module.exports = router;
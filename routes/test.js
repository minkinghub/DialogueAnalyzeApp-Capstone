const express = require('express');
const router = express.Router();

router.post('/api/test', (req, res) => {
    const user = req.session.user;

    if (user) {
        res.json({ username: user.username });
    } else {
        res.status(401).json({ message: '로그인 필요' });
    }
});

module.exports = router;
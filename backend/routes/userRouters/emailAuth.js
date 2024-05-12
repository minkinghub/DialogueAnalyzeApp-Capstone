const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const { code } = req.body;

    if (req.session.verificationCode === code) {
        res.status(200).send('인증 성공!');
    } else {
        res.status(400).send('인증 실패. 코드가 일치하지 않습니다.');
    }
});

module.exports = router;
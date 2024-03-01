const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models/User');

// http:localhost:3000/api/users/changePass
router.post('/', async (req, res) => {
    const { password, newPassword } = req.body;
    const userId = req.session.user.userId;

    const user = await User.findById(userId);

    // 기존 비밀번호가 일치하는지 확인
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // 새 비밀번호가 최근 6개월 동안 사용되지 않은 비밀번호인지 확인
    const recentPasswords = user.recentPasswords;
    for (let i = 0; i < recentPasswords.length; i++) {
        const validNewPassword = await bcrypt.compare(newPassword, recentPasswords[i].password);
        if (validNewPassword) {
            return res.status(400).json({ message: '최근 6개월 동안 사용한 비밀번호입니다.' });
        }
    }

    // 최근 6개월 동안 사용한 비밀번호 목록에 현재 비밀번호 추가
    const currentTime = new Date();
    user.recentPasswords = user.recentPasswords.filter(
        usedPassword => currentTime - usedPassword.date < 6 * 30 * 24 * 60 * 60 * 1000 // 6개월 이내
    );

    const hashedPassword = await bcrypt.hash(password, 10);
    user.recentPasswords.unshift({ password: hashedPassword, date: currentTime });

    // 새 비밀번호로 변경
    user.password = newPassword;

    await user.save().catch(err => {
        console.error(err);
        return res.status(500).json({ message: '서버 오류' });
    });

    return res.status(200).json({ message: '비밀번호가 변경되었습니다.' });

});

module.exports = router;
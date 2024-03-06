const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../../models/User');

// http:localhost:3000/api/users/resetPass
router.post('/', async (req, res) => {
    // 입력한 email 형식 id가 실제 존재하는 지 확인하고, 있으면 임시 비밀번호 발급
    const { id } = req.body;
    const user = await User.findOne({ id });

    if (!user) {
        return res.status(400).json({ message: '존재하지 않는 이메일입니다.' });
    }

    // 임시 비밀번호 생성하되, 문자, 숫자, 특수문자를 각각 최소 1개씩 포함하도록 구성
    function generateTempPassword() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        let tempPassword = '';
        let hasNumber = false;
        let hasUpperCase = false;
        let hasLowerCase = false;
        let hasSpecial = false;

        for (let i = 0; i < 10; i++) {
            tempPassword += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        for (let i = 0; i < tempPassword.length; i++) {
            if ('0' <= tempPassword[i] && tempPassword[i] <= '9') {
                hasNumber = true;
            } else if ('A' <= tempPassword[i] && tempPassword[i] <= 'Z') {
                hasUpperCase = true;
            } else if ('a' <= tempPassword[i] && tempPassword[i] <= 'z') {
                hasLowerCase = true;
            } else {
                hasSpecial = true;
            }
        }

        if (!hasNumber || !hasUpperCase || !hasLowerCase || !hasSpecial) {
            return generateTempPassword();
        }

        return tempPassword;
    }
    const tempPassword = generateTempPassword();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    // 임시 비밀번호로 변경
    await User
        .findOneAndUpdate({ id }, { password: hashedPassword })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ message: '서버 오류' });
        });

    // 이메일 발송
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: id,
        subject: '임시 비밀번호 발급',
        text: `임시 비밀번호: ${tempPassword}`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: '서버 오류' });
        }
        console.log('Email sent: ' + info.response);
        return res.status(200).json({ message: '이메일로 임시 비밀번호를 발송했습니다.' });
    });
})

module.exports = router;
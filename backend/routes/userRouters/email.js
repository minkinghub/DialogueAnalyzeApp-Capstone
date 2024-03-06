const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

function generateVerificationCode() {
    const code = Math.random().toString(36).substr(2, 6).toUpperCase();
    return code;
}

// http://localhost:3000/api/users/email 이메일 인증
router.post('/', (req, res) => {

    const { email } = req.body;
    const verificationCode = generateVerificationCode();
    const subject = '이메일 인증 코드';
    const text = `인증 코드: ${verificationCode}`;

    req.session.verificationCode = verificationCode;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('error');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('success');
        }
    }
    );
}
);

module.exports = router;
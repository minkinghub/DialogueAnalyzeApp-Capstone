const express = require('express');
const router = express.Router();
const { UserModel } = require('../../models/User');

// http://localhost:3000/api/users/idCheck 아이디 중복 검사
router.post('/', async (req, res) => {
    try {
        const user = await UserModel.findOne({ id: req.body.id });
        if (user) {
            return res.json({ success: false, message: "이미 존재하는 아이디입니다." });
        }
        return res.json({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: err.message });
    }
}
);

module.exports = router;
const express = require('express');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

const { analyzeText } = require("../controllers");

router.post('/analyze/text', upload.single('file'), analyzeText) // /api/upload/analyze/text

module.exports = router
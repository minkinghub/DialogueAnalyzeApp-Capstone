const multer = require('multer');
const express = require('express');
const { uploadToFirebase } = require('../utils/firebase');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const result = await uploadToFirebase(file);
    res.status(200).json({ url: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

module.exports = router;
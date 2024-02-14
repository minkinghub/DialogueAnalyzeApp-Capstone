const express = require('express');
const router = express.Router();
const SearchModel = require('./../models/searchModel');

router.get('/api/search', async (req, res) => {
    const { key } = req.query;
    console.log("검색어 : ",  key);
  
    try {
      const data = await SearchModel.find({ NAME: { $regex: key, $options: 'i' }})
      .sort({ FAT : -1})
      .limit(5);
      res.json(data);
    } catch (err) {
      console.error('데이터 조회 중 오류:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
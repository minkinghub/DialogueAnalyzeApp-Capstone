const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_HOST);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB 연결 오류:'));

const TestModel = mongoose.model('test2', new mongoose.Schema({
}));

app.get('/api/test', async (req, res) => {
  try {
    const data = await TestModel.find({}).limit(10);
    res.json(data);
  } catch (err) {
    console.error('데이터 조회 중 오류:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
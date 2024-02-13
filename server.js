const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
require('dotenv').config();
const mongoose = require('mongoose');

const updateSession = require('./middlewares/updateSession');

const loginRouter = require('./routes/login');
const testRouter = require('./routes/test');

mongoose.connect(process.env.DB_HOST);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB 연결 오류:'));

const TestModel = mongoose.model('test2', new mongoose.Schema({}));

app.use(bodyParser.json());

app.use(cors()); // CORS 설정

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 60 * 20 * 1000, // 유효 기간 20분
    secure: false } // HTTPS를 사용하는 경우 true로 변경
}));

app.use(updateSession); // 세션 갱신 미들웨어 사용

app.get('/api/db', async (req, res) => {
  try {
    const data = await TestModel.find({}).limit(10);
    res.json(data);
  } catch (err) {
    console.error('데이터 조회 중 오류:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use(testRouter); // '/api/test' 경로에 대한 라우터 사용
app.use(loginRouter); // '/api/login' 경로에 대한 라우터 사용

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
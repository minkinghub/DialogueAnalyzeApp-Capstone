require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 3000;
const updateSession = require('./backend/middlewares/updateSession');
const loginRouter = require('./backend/routes/login');
const testRouter = require('./backend/routes/test');
const userRouters = require('./backend/routes/userRouters');
const mongoose = require('mongoose');

const TestModel = mongoose.model('test2', new mongoose.Schema({}));

// mongoDB 연결
mongoose
  .connect(process.env.DB_HOST)
  .then(() => console.log('몽고DB 연결중...'))
  .catch(e => console.error(e));

app.get('/', (req, res) => {
  res.send("안녕하세요?");
});

app.use(bodyParser.urlencoded({ extended: true }));
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

app.use("/api/users", userRouters); // 로그인, 회원가입, 로그아웃에 대한 라우터
app.use(testRouter); // '/api/test' 경로에 대한 라우터 사용
app.use(loginRouter); // '/api/login' 경로에 대한 라우터 사용

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
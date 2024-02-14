const express = require('express'); // 서버 기본 모듈 추가
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config(); // env 파일 사용
const app = express();
const port = process.env.PORT || 3000;

const connectToMongoDB = require('./configs/mongo'); // MongoDB 연결 추가
const db = connectToMongoDB();

const updateSession = require('./middlewares/updateSession'); // 미들웨어 추가

const loginRouter = require('./routes/login'); // 라우터 추가
const testRouter = require('./routes/test');
const searchRouter = require('./routes/search');

app.use(bodyParser.json()); // JSON 요청 처리

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

app.use(testRouter); // '/api/test' 경로에 대한 라우터 사용
app.use(loginRouter); // '/api/login' 경로에 대한 라우터 사용
app.use(searchRouter);

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
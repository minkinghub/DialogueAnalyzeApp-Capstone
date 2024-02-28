const express = require('express'); // 서버 기본 모듈 추가
const helmet = require('helmet'); // 보안 모듈 추가
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config(); // env 파일 사용
const app = express();
const port = process.env.PORT || 3000;

const updateSession = require('./backend/middlewares/updateSession'); // 세션 미들웨어 추가

const testRouter = require('./backend/routes/test'); // 테스트 라우터 추가
const userRouters = require('./backend/routes/userRouters'); // 사용자 라우터 추가
const searchRouter = require('./backend/routes/search'); // 검색 라우터 추가
const uploadRouter = require('./backend/routes/upload'); // 업로드 라우터 추가

// firebase 관련 설정
const admin = require('firebase-admin');
const serviceAccount = require('./backend/key/calendar.json')

// fireebase Admin 초기화
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "calendarrecipe.appspot.com"
});

// MongoDB 연결, 절대 지우지 말 것! 오류남!
const connectToMongoDB = require('./backend/configs/mongo') // MongoDB 연결 추가
const db = connectToMongoDB();

app.use(bodyParser.json()); // JSON 요청 처리

app.use(helmet()); // 보안 모듈 사용
app.use(bodyParser.urlencoded({ extended: true }));
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

app.use("/api/users", userRouters); // 로그인, 회원가입 등에 대한 라우터
app.use(testRouter); // '/api/test' 경로에 대한 라우터 사용
app.use(searchRouter); // '/api/search' 경로에 대한 라우터 사용
app.use(uploadRouter); // '/api/upload' 경로에 대한 라우터 사용

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});

app.use(express.static('public'));
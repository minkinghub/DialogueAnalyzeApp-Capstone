//const user = require('./front/controller/user'); // controller import
//import user from './front/src/controller/user.js';
// const loginRoutes = require('./backend/server/login');
import loginRoutes from './backend/server.js';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
// .env에 입력된 포트값 사용, 없으면 3000(기본)포트 사용
console.log("dotenv 정상 작동 확인: ", process.env.PORT);
const port = process.env.PORT || 3000;

app.use(express.json())
app.use('/api/users', loginRoutes);

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});

// 기본 라우트
app.get('/', (req, res) => {
  res.send('간단한 노드 서버입니다.');
});

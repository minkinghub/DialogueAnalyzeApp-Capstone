const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// 기본 라우트
app.get('/', (req, res) => {
  res.send('간단한 노드 서버입니다.');
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
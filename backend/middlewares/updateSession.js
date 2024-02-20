const serverStartTime = new Date();

const serverTimeZone = 'Asia/Seoul';
const serverStartTimeInTimeZone = new Intl.DateTimeFormat('en-US', {
    timeZone: serverTimeZone,
    hour12: false, // 24시간 표시를 위해
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
}).format(serverStartTime);

function updateSession(req, res, next) {
    //if(req.path !== '/api/login') {
    if (req.path !== '/api/users/login') {
        if (req.session.user) {
            // 세션에 사용자 정보가 있으면 갱신
            req.session.user.lastAccessed = new Date();
            console.log("세션 갱신됨:", serverStartTimeInTimeZone);
        } else {
            console.log("세션 없음");
        }
        next();
    } else {
        console.log("로그인 api, 세션 처리 안함");
        next();
    }
}
  
  module.exports = updateSession;
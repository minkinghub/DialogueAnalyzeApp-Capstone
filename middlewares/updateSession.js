function updateSession(req, res, next) {
    if(req.path !== '/api/login') {
        if (req.session.user) {
            // 세션에 사용자 정보가 있으면 갱신
            req.session.user.lastAccessed = new Date();
            console.log("세션 갱신됨:", req.session.user.lastAccessed);
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
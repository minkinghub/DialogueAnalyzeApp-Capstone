import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import { connect } from 'mongoose';
import auth from "./middleware/Auth";
import User from "./models/User";

const app = express();
dotenv.config();

// 서버에서 가져온 데이터를 파싱에서 가져옴
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cors());

connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    // useCreateIndex: true,
    // useFindAndModify: false,
})
    .then(() => console.log('몽고DB 연결 성공!!!'))
    .catch(e => console.error(e));

app.get('/', (req, res) => {
    res.send("안녕하세요?");
});

// 회원가입
app.post("/register", (req, res) => {
    const user = new User(req.body);

    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true,
        });
    });
});


//로그인
app.post("/login", (req, res) => {
    // 1. 요청된 이메일이 DB에 존재하는 지 확인
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "이메일에 해당하는 유저가 없습니다.",
            });
        }
        // 2. 이메일 존재 시, 비밀번호 일치하는 지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({
                    loginSuccess: false,
                    message: "비밀번호가 틀렸습니다.",
                });
            // 3. 비밀번호도 일치하면 토큰 생성
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                //토큰을 저장한다. where? 쿠키 OR 로컬 스토리지 OR 세션스토리지
                //쿠키 name : value
                res
                    .cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id });
            });
        });
    });
});

// 회원 분류(비회원, 회원, 관리자)
app.get("/auth", auth, (req, res) => {
    // 일단 로그인은 성공하셨으니 비회원은 아님
    res.status(200).json({
        _id: req.user._id,
        // 0이면 일반유저, 아니면 관리자
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
    });
});

// 로그아웃
app.get("/api/users/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({ success: true });
    });
});

app.listen(process.env.PORT, () => {
    console.log(`예시 앱 주소 http://localhost:${process.env.PORT}`);
})
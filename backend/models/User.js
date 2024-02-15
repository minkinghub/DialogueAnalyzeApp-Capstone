const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 150,
  },
  // 주의: id가 email이므로 @ 같은 규칙 제작 必
  id: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  birthday: {
    type: Number,
    length: 8,
  },
  gender: {
    type: String,
    minlength: 3,
  },
  lastname: {
    type: String,
    maxlength: 150,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  //토큰 유효기간
  tokenExp: {
    type: Number,
  },
});

// 비밀번호 해싱
userSchema.pre("save", function (next) {
  const user = this;
  const saltFactor = 10;
  bcrypt.genSalt(saltFactor, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    })
  })
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  // plainPassword : 123456 / 암호화된 비번 : #!@#1241@$1~!asd
  //plainPassword 암호화 해서 비교한다
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  //jsonwebToken을 이용하여 토큰 생성 user._id는 mongo id
  // user._id + 'secretToken' = token
  //jwt.sign(payload, secretKey)이 기대값
  //user_.id는 문자열이 아니기 때문에 .toHexString으로 24바이트 16진수 문자열로 바꿔줌?
  var token = jwt.sign(user._id.toHexString(), "secretToken");
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  //token decode
  jwt.verify(token, "secretToken", function (err, decoded) {
    //유저 아이디를 이용해서 유저를 찾은 다음에
    //클라이언트에서 가져온 토큰과 디비에 보관된 토큰이 일치하는지 확인
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
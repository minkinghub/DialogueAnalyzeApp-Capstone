const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const currentYear = new Date().getFullYear(); // 현재 날짜 이후 생년월일은 오류

const userSchema = mongoose.Schema({
  nickname: {
    type: String,
    maxlength: 150,
    validate: {
      validator: async function (v) {
        const user = await this.constructor.findOne({ name: v });
        if (user) {
          if (this._id.toString() === user._id.toString()) return true;
          return false;
        }
        return true;
        },
        message: props => `${props.value}는 이미 존재하는 이름입니다.`
    },
  },
  // 주의: id가 email임
  id: {
    type: String,
    trim: true,
    unique: 1,
    validate: [
      {
      validator: (v) => /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v),
      message: '아이디는 이메일 형식이어야 합니다.'
    },
    {
      validator: async function (v) {
        const user = await this.constructor.findOne({ id: v });
        if (user) {
          if (this._id.toString() === user._id.toString()) return true;
          return false;
        }
        return true;
      },
      message: props => `${props.value}는 이미 존재하는 아이디입니다.`
    }
  ]
  },
  password: {
    type: String,
    minlength: 5,
    validate: {
      validator: (v) => /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{5,20}$/.test(v),
      message: '비밀번호는 영문, 숫자, 특수문자를 포함하여 5~20자리로 구성되어야 합니다.'
    }
  },
  birthday: {
    type: Number,
    length: 8,
    validate: {
      validator: (v) => {
        const year = Math.floor(v / 10000);
        const month = Math.floor((v % 10000) / 100);
        const day = v % 100;
        if (year < 1900 || year > currentYear) return false;
        if (month < 1 || month > 12) return false;
        if (day < 1 || day > 31) return false;
        return true;
      },
      message: '유효한 생년월일을 입력해주세요.'
    }
  },
  gender: {
    type: String,
    minlength: 3,
  },
  height: {
    type: Number,
    required: true,
    min: 0,
    message: '키는 0 이상의 숫자여야 합니다.'
  },
  weight: {
    type: Number,
    required: true,
    min: 0,
    message: '몸무게는 0 이상의 숫자여야 합니다.'
  },
  follows: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }], // 팔로우 목록
  nid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Nutrient",
  },
  role: {
    type: Number,
    default: 0,
  },
  imageUrl: String,
  // 최근 6개월 동안 사용한 비밀번호 목록
  recentPasswords: [{ password: String, date: Date }], 
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

const User = mongoose.model("User", userSchema);

module.exports = { User };
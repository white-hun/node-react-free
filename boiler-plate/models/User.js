const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Schema: DB에서 자요의 구조(개체, 속성, 관계)와 제약 조선에 대한 정의
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, // 작성 시 space바를 쳤을 때 생긴 빈칸을 없에 줌
    unique: 1, // 중복되는 e-mail 사용불가
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  // 일반사용자와 관리자 등을 구분(ex. 0:일반사용자, 1:관리자)
  role: {
    type: Number,
    default: 0,
  },
  image: String, // object( '{}' ) 를 사용하지 않고 사용할 수도 있다
  // 유효성 관리등에 사용
  token: {
    type: String,
  },
  // token의 유효기한
  tokenExp: {
    type: Number,
  },
});

// mongoose method
// User model을 저장하기 전에 처리한다
userSchema.pre("save", function (next) {
  // userSchema 데이터를 지칭함
  var user = this;

  // password가 변경될 때만 암호화한다
  if (user.isModified("password")) {
    // 비밀번호 암호화
    // salt 생성
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      // hash: 암호화된 비밀번호
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        // 암호화가 끝나고 다음 코드를 진행 시킨다(save 라인)
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model("User", userSchema);

module.exports = { User };

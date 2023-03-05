const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

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
      // hash 생성(hash: 암호화된 비밀번호)
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        // 암호화가 끝나고 다음 라인을 진행 시킨다(user.save())
        next();
      });
    });
    // password가 아닌 다른 데이터를 바꿀 때는 다음 라인(user.save())으로 넘어가도록 else 작성
  } else {
    next();
  }
});

//---comparePassword method-----------------------------------------------------------------------------
userSchema.methods.comparePassword = function (plainPassword, cb) {
  // plainPassword가 맞다면 암호화된 비밀번호가 일치하는지 확인해야한다
  // plainPassword: 12345678
  // hash: $2b$10$NBnuiUeAxr./GThdME9uUezmc4M1tlnqY5M5whSw2egx9Y/baKIBa
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err)
      // err
      return (
        cb(err),
        //eles
        // err가 없다면 err는 null, password 일치(true) isMatch= true를 comparePassword로 전달
        cb(null, isMatch)
      );
  });
};

//---generateToken method-------------------------------------------------------------------------------
userSchema.methods.generateToken = function (cb) {
  var user = this;
  // jsonwebtoken을 이용해서 token을 생성하기
  var token = jwt.sign(user._id.toHexString(), "secretToken"); // user._id + "secretToken" = token  // secretToken을 넣으면  user._id가 나온다
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    // else
    // err가 없다면 err는 null, user 정보가 generateToken으로 전달
    cb(null, user);
  });
};

//------------------------------------------------------------------------------------------------------

const User = mongoose.model("User", userSchema);

module.exports = { User };

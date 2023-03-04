const mongoose = require("mongoose");

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

const User = mongoose.model("User", userSchema);

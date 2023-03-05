const express = require("express"); // 다운받은 express 불러오기 = ES6 문법의 import 시스템
const app = express(); // 새로운 express app을 만든다
const port = 5000; // port 지정(백서버 지정)
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { User } = require("./models/User");
const config = require("./config/key");

// application/x-www-form-urlencoded 형식의 데이터를 분석해서 가져올 수 있게 해준다
app.use(bodyParser.urlencoded({ extended: true }));
// application/json 형식의 데이터를 분석해서 가져올 수 있게 해준다.
app.use(bodyParser.json());
// cookie-parser 사용
app.use(cookieParser());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World!")); // "/" : root directory

//---register Router--------------------------------------------------------------------------------
// 회원 가입 할때 필요한 정보들을 client에서 가져오면 정보들을 DB에 넣어준다
app.post("/register", (req, res) => {
  // bodyParser를 통해 req.body에 client에 필요한 json 형식 데이터가 들어올 수 있다
  const user = new User(req.body);
  // mongoDB method
  user
    .save()
    .then(() => {
      res.json({ success: true });
    })
    .catch((err) => {
      res.json({ success: false, err });
    });
});

//---login Router-----------------------------------------------------------------------------------
app.post("/login", (req, res) => {
  // 요청된 email을 DB에 존재하는지 찾는다
  // mongoDB method
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }

    // 요청된 email이 DB에 있다면 password가 맞는지 확인
    // comparePassword method를 User.js에서 만든다
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });

      // password가 맞다면 token 생성
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        // token을 저장(쿠키, 로컬스토리지, 세션스토리지 등)
        res.cookie("x-auth", user.token).status(200).json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

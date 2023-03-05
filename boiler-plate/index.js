const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const { User } = require("./models/User");
const config = require("./config/key");

// application/x-www-form-urlencoded 형식의 데이터를 분석해서 가져올 수 있게 해준다
app.use(bodyParser.urlencoded({ extended: true }));

// application/json 형식의 데이터를 분석해서 가져올 수 있게 해준다.
app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World!"));

// register Router
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

//----------------------------------------------------------------------------
// 다운받은 express 불러오기 = ES6 문법의 import 시스템
// 새로운 express app을 만든다
// port 지정(백서버 지정)

// "/" : root directory
// app에 get 요청 => Hello Woeld! 출력
// 5000port에서 실행

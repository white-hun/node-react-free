const express = require("express");
const app = express();
const port = 5000;

const mongoose = require("mongoose");
mongoose
  .connect("mongodb+srv://white:b17s90h610@cluster0.sypzapd.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.error(err));

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

//----------------------------------------------------------------------------
// 다운받은 express 불러오기 = ES6 문법의 import 시스템
// 새로운 express app을 만든다
// port 지정(백서버 지정)

// "/" : root directory
// app에 get 요청 => Hello Woeld! 출력
// 5000port에서 실행

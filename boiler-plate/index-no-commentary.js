const express = require("express");
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { User } = require("./models/User");
const config = require("./config/key");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World!"));

//---register Router--------------------------------------------------------------------------------
app.post("/register", (req, res) => {
  const user = new User(req.body);
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
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res
          .cookie("x-auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});
//--------------------------------------------------------------------------------------------------

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

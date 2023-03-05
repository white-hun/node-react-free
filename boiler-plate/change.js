app.post("/regidter", (req, res) => {
  const user = new User(req.body);
  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});
//-----------------------------------------------------

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

//==========================================================================

app.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie("x-auth", user.token).status(200).json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

//--------------------------------------------------------------------------
app.post("/login", (req, res) => {
  User.findOne({ email: req.body.email })
    // .then((user) => {
    //   res.json({ loginSuccess: true });
    // })
    .catch((err) => {
      res.json({ loginSuccess: false, err, message: "제공된 이메일에 해당하는 유저가 없습니다." });

      user
        .comparePassword(req.body.password)
        // .then((isMatch) => {
        //   res.json({ loginSuccess: true });
        // })
        .catch((err) => {
          res.json({ loginSuccess: false, err, message: "비밀번호가 틀렸습니다" });

          user
            .generateToken()
            .then((user) => {
              res.cookie("x-auth", user.token).json({ loginSuccess: true, userId: user._id });
            })
            .catch((err) => {
              res.send(err);
            });
        });
    });
});

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = mongoose.model("users");
const bcrypt = require("bcryptjs");
const isAuthorized = require("../middlewares/Authorized");
const validator = require("validator");

module.exports = app => {
  app.post("/api/register", async (req, res) => {
    const checkEmail = validator.isEmail(req.body.email);
    const checkFirstname = validator.isLength(req.body.firstname, { min: 5 });

    if (checkEmail & checkFirstname) {
      const checkEmailExist = await User.findOne({
        email: req.body.email
      });

      if (checkEmailExist) {
        res.send({ status: "fail", messages: "already have an email" });
      }

      const user = new User();
      user.firstname = req.body.firstname;
      user.lastname = req.body.lastname;
      user.email = req.body.email;
      user.password = bcrypt.hashSync(req.body.password);
      user.birthday = req.body.birthday;
      user.gender = req.body.gender;
      user.save();
      let token = jwt.sign({ userID: user._id }, "secret");
      res.send({ status: "success", token: token });
    } else {
      res.send({ status: "fail", messages: "something went wrong" });
    }
  });

  app.post("/api/login", async (req, res) => {
    const login = await User.findOne({
      email: req.body.email
    });
    if (login) {
      if (bcrypt.compareSync(req.body.password, login.password)) {
        let token = jwt.sign({ userID: login._id }, "secret");
        res.send({ status: "success", token: token });
      } else {
        res.send({ status: "password wrong" });
      }
    } else {
      res.send({ status: "email wrong" });
    }
  });

  app.get("/api/getUserInfo", isAuthorized, async (req, res) => {
    const token = req.headers.authorization;
    const decoded = jwt.decode(token);
    const myInfo = await User.findOne({
      id: decoded.userId
    });

    const information = {
      id: myInfo.id,
      firstname: myInfo.firstname,
      lastname: myInfo.lastname,
      email: myInfo.email,
      birthday: myInfo.birthday,
      gender: myInfo.gender
    };

    res.json({ status: "success", data: information });
  });

  app.put("/api/change-password", isAuthorized, async (req, res) => {
    const token = req.headers.authorization;
    const decoded = jwt.decode(token);
    const myInfo = await User.findOne({
      id: decoded.userId
    });

    myInfo.firstname = req.body.firstname;
    myInfo.lastname = req.body.lastname;
    myInfo.email = req.body.email;
    myInfo.password = bcrypt.hashSync(req.body.password);
    myInfo.birthday = req.body.birthday;
    myInfo.gender = req.body.gender;
    myInfo.save();

    let newToken = jwt.sign({ userID: myInfo.id }, "secret");
    res.send({ status: "success", token: newToken });
  });
};

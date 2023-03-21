const bcryptjs = require("bcryptjs");
const user = require("../models/user");
// const nodemailer = require("nodemailer")
// const sendfridTransport = require("nodemailer-sendgrid-transport")

const User = require("../models/user");

// const transporter = nodemailer.createTransport(sendfridTransport({
//   auth: {
//     api_key: "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"
//   }
// }))

exports.postSignup = (req, res, next) => {
  fullName = req.body.fullname;
  email = req.body.email;
  password = req.body.password;
  phoneNumber = req.body.phonenumber;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.json({
          message: "Email already exists!",
          user: [],
        });
      } else {
        return bcryptjs
          .hash(password, 12)
          .then((hashedPassword) => {
            const user = new User({
              fullName: fullName,
              email: email,
              password: hashedPassword,
              phoneNumber: phoneNumber,
              role: "client",
              cart: {
                items: [],
              },
            });
            return user.save();
          })
          .then((data) => {
            return res.status(201).json({
              message: "Success!",
              user: [email],
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogin = (req, res, next) => {
  email = req.body.email;
  password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        res.json({
          message: "Email is incorrect!",
          isLogin: false,
          userId: "",
          userName: "",
        });
      } else {
        bcryptjs
          .compare(password, user.password)
          .then((doMatch) => {
            if (doMatch) {
              req.session.isLogin = true;
              req.session.user = user;
              res.status(200).json({
                message: "Success!",
                isLogin: req.session.isLogin,
                userId: req.session.user._id,
                userName: req.session.user.fullName,
              });
              return req.session.save();
            } else {
              res.json({
                message: "Password is incorrect!",
                isLogin: false,
                userId: "",
                userName: "",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

// khu vực code auth admin

exports.loginAdmin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.json({
          message: "Account does not exist!",
          isLogin: false,
        });
      } else {
        bcryptjs
          .compare(password, user.password)
          .then((doMatch) => {
            if (!doMatch) {
              return res.json({
                message: "account information password is not correct!",
                isLogin: false,
              });
            } else {
              if (user.role === "admin" || "Counselors") {
                req.session.isLogin = true;
                req.session.user = user;
                console.log("ngon!");
                res.status(200).json({
                  message: "Success!",
                  isLogin: req.session.isLogin,
                  userId: req.session.user._id,
                  name: req.session.user.fullName,
                  email: user.email,
                });
              } else {
                res.json({
                  message:
                    "The account does not have permission to login to the web!",
                  isLogin: false,
                });
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

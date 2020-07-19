const userModel = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const tokenExpirationTime = "4h"

module.exports = {
  create: function (req, res, next) {
    userModel.findOne({ email: req.body.email }, (err, userInfo) => {
      if(err)
        return next(err);
      else if(userInfo)
        res.status(400).json({
          status: 'error',
          message: "This email is already taken",
          data: null,
        })
      else {
        userModel.create(
          {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            tasks: {
              tasksOrder: [],
              tasks: []
            },
            projects: [],
            timelogs: [],
            settings: {},
            archives: {
              tasks: []
            },
            private: {
              is_member: false,
              is_new: true
            }
          },
          function (err, result) {
            if(result)
              console.log('debug: result from user create:' + result)
    
            if (err)
              next(err);
            else {
              // console.log('user password created:', result.user.password)
              res.status(201).json({
                status: "success",
                message: "User added successfully!",
                data: null,
              });
          }}
        );
      }
    })
  },
  authenticate: function (req, res, next) {
    userModel.findOne({ email: req.body.email }, function (err, userInfo) {
      if (err) {
        next(err);
      } else if(userInfo) {
        if (bcrypt.compareSync(req.body.password, userInfo.password)) {
          const token = jwt.sign(
            { id: userInfo._id },
            req.app.get("secretKey"),
            { expiresIn: tokenExpirationTime }
          );
          // console.log('user model:', userInfo)
          // userInfo.projects=[];
          // userInfo.settings={}
          // userInfo.save();

          res.status(200).json({
            status: "success",
            message: "user found!",
            data: {
              userData: {
                _id: userInfo._id,
                name: userInfo.name,
                email: userInfo.email,
              },
              userSettings: userInfo.settings ? userInfo.settings : [],
              userStatus: { is_new: true },
              // userStatus: userInfo.status.is_new ? { is_new: true } : { is_member: userInfo.status.is_member },
              token: token
            },
          });
        } else {
          console.log('bcrypt compared the two and did not find them equal')
          res.status(400).json({
            status: "error",
            message: "Invalid email/password",
            data: null,
          });
        }
      }
      else {
        console.log('userInfo (not found):', userInfo)
        res.status(404).json({
          status: "error",
          message: "User not found!",
          data: null,
        })
      }
    });
  },
  resetPassword: function(req, res, next) {
    const email = req.params.email;

    if(email) {
      console.log('user wants to reset password with email:', email)

    }

    res.status(400).json({
      status: "error",
      message: "This feature is not enabled yet",
      data: null
    })
  },
  getUserData: async (req, res, next) => {
    
  }
};

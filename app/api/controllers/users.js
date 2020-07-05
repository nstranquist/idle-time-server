const userModel = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const tokenExpirationTime = "4h"

module.exports = {
  create: function (req, res, next) {
    userModel.findOne({ email: req.body.email }, (err, userInfo) => {
      if(err)
        return next(err);
      
      if(userInfo)
        res.status(400).json({
          type: 'error',
          message: "This email is already taken",
          data: null,
        })
      else {
        userModel.create(
          {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          },
          function (err, result) {
            if(result)
              console.log('debug: result from user create:' + result)
    
            if (err)
              next(err);
            else
              res.status(200).json({
                type: "success",
                message: "User added successfully!",
                data: null,
              });
          }
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
          res.status(200).json({
            type: "success",
            message: "user found!",
            data: {
              user: {
                _id: userInfo._id,
                name: userInfo.name,
                email: userInfo.email,
              },
              token: token
            },
          });
        } else {
          res.status(400).json({
            type: "error",
            message: "Invalid email/password",
            data: null,
          });
        }
      }
      else {
        console.log('userInfo:', userInfo)
        res.status(404).json({
          type: "error",
          message: "User not found!",
          data: null,
        })
      }
    });
  },
};

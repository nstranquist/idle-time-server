const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

const tokenExpirationTime = '4h';

module.exports = {
  create: async (req, res, next) => {
    try {
      console.log('req.body:', req.body);
      if (!req.body.name) {
        res
          .status(400)
          .json({
            ok: false,
            message: 'The name is not defined',
            data: null,
          });
      }
      if (!req.body.email) {
        res
          .status(400)
          .json({
            ok: false,
            message: 'The email is not defined',
            data: null,
          });
      } else if (!req.body.password) {
        res
          .status(400)
          .json({
            ok: false,
            message: 'The password is not defined',
            data: null,
          });
      }
    } catch (error) {
      console.log('error cuahgt:', error.toString());
      next(error);
    }

    const { name, email, password } = req.body;

    if (password.length < 8) {
      res
        .status(400)
        .json({ message: 'The password is too short', data: null });
    }

    userModel.findOne({ email }, (err, userInfo) => {
      if (err) {
        return next(err);
      }
      if (userInfo) {
        res.status(400).json({
          ok: false,
          message: 'This email is already taken',
          data: null,
        });
      } else {
        userModel.create(
          {
            name,
            email,
            password,
            tasks: {
              tasksOrder: [],
              tasks: [],
            },
            projects: [],
            timelogs: [],
            settings: {},
            archives: {
              tasks: [],
            },
            private: {
              is_member: false,
              is_new: true,
            },
          },
          (err, result) => {
            if (err) {
              console.log('error:', err);
              next(err);
            } else {
              // console.log('user password created:', result.user.password)
              res.status(201).json({
                ok: true,
                message: 'User added successfully!',
                data: null,
              });
            }
          }
        );
      }
    });
  },
  authenticate: async (req, res, next) => {
    userModel.findOne({ email: req.body.email }, (err, userInfo) => {
      if (err) {
        next(err);
      } else if (userInfo) {
        if (bcrypt.compareSync(req.body.password, userInfo.password)) {
          const token = jwt.sign(
            { id: userInfo._id },
            req.app.get('secretKey'),
            { expiresIn: tokenExpirationTime }
          );
          // console.log('user model:', userInfo)
          // userInfo.timelogs = [];
          // userInfo.save();

          res.status(200).json({
            ok: true,
            message: 'user found!',
            data: {
              userData: {
                _id: userInfo._id,
                name: userInfo.name,
                email: userInfo.email,
              },
              userSettings: userInfo.settings ? userInfo.settings : [],
              userStatus: { is_new: true },
              // userStatus: userInfo.status.is_new ? { is_new: true } : { is_member: userInfo.status.is_member },
              token,
            },
          });
        } else {
          console.log('bcrypt compared the two and did not find them equal');
          res.status(400).json({
            ok: false,
            message: 'User not found!',
            data: null,
          });
        }
      } else {
        console.log('userInfo (not found):', userInfo);
        res.status(404).json({
          ok: false,
          message: 'User not found!',
          data: null,
        });
      }
    });
  },
  resetPassword(req, res, next) {
    const { email } = req.params;

    if (email) {
      console.log('user wants to reset password with email:', email);
    }

    res.status(400).json({
      ok: false,
      message: 'This feature is not enabled yet',
      data: null,
    });
  },
  getUserData: async (req, res, next) => {},
};

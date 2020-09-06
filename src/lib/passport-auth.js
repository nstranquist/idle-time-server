const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('../modules/users/user.model');

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (username, password, done) => {
      try {
        // implement authentication logic
        const user = await UserModel.findOne({ email: username }).exec(); // 'exec' gives promise back
        if (!user) {
          return done(null, false, { message: 'Invalid username or password' }); // second
        }
        const passwordOK = await user.comparePassword(password);
        if (!passwordOK) {
          return done(null, false, { message: 'Invalid username or password' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// eslint-disable-next-line no-underscore-dangle
passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser(async (id, done) => {
  try {
    // try to load user from database
    const user = await UserModel.findById(id).exec();
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

module.exports = {
  initialize: passport.initialize(),
  session: passport.session(),
  setUser: (req, res, next) => next(),
};

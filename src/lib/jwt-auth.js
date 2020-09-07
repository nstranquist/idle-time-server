const jwt = require('jsonwebtoken');

const validateUser = (req, res, next) => {
  jwt.verify(
    req.headers['x-access-token'],
    req.app.get('secretKey'),
    (err, decoded) => {
      if (err) {
        return res.json({ ok: false, message: err.message, data: null });
      }
      // add user id to request
      req.body.userId = decoded.id;
      return next();
    }
  );
};

module.exports = validateUser;

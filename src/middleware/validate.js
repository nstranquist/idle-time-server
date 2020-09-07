const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    return next();
  } catch (error) {
    let message = error;
    if (error.details && error.details[0] && error.details[0].message) message = error.details[0].message;
    return res.status(400).json({
      ok: false,
      message
    });
  }
};

module.exports = {
  validateBody
};

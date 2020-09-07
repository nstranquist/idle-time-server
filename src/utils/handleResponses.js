const handleError = (res, message, code = 400) => res.status(code).json({
  ok: false,
  message,
  data: null,
});
const handleSuccess = (res, message, code = 200, data = null) => res.status(code).json({
  ok: true,
  message,
  data,
});

module.exports = { handleError, handleSuccess };

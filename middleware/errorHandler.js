const ErrorResponse = require("../utils/errorResponse");


// catch all errors we pass to the next variable,  whenever we call next() and we pass it some error, it automatically gets sent to the error handler middleware
// 检验error对象的属性， 生成一个customError message对象，最终返回前端 以结束end the request-response cycle
const errorHandler = (err, req, res, next) => {
  // spread the error variable
  let error = { ...err };

  error.message = err.message;
  console.log('sha');
  console.log(error);
  if (err.code === 11000) {
    const message = `Duplicate Field value entered`;
    error = new ErrorResponse(message, 400);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  console.log(error.message);

  // End the request-response cycle
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
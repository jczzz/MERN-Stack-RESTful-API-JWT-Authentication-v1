
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");


// check if the user has json web token in the header
exports.isAuth = async (req, res, next) => {
  let token;
  
  // 检查提取后续request的header里的json web token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
      // look like : Bearer 423fhjkfhkjhrj4hh1jhf4jqh
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
      // 没有授权进入该路径
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
      // 解码, 编码时 token =  jwt.sign({ id: user._id }, process.env.JWT_SECRET）
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //  可得授权用户信息
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorResponse("No user found with this id", 404));
    }
    // 生成req.user
    req.user = user;
    // 传递中间件
    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorized to access this router", 401));
  }
};

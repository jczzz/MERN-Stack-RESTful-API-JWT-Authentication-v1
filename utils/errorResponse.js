// 自定义错误对象需要继承自 原生js对象Error
// some blueprint for  CustomError


class ErrorResponse extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  module.exports = ErrorResponse;
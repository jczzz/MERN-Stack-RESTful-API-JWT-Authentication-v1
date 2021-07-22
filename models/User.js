const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // node 原生 module


const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required:[true, "please provide a user"]
    },
    email:{
        type: String,
        required:[true, "please provide an email"],
        unique: true,
        // match by regular expression,  google regular expression for email
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email",
        ]
    },
    password:{
        type: String,
        required: [true, "Please add a password"],
        minlength: 6,
        // wherever query for a user, do we want to return password as well? set this to false because we don't want ,unless we explicitly ask a query for it
        select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

// 在user 创建后存入前 插入一个中间件函数验证密码是否编译
UserSchema.pre("save", async function (next) {

    // 这里的isModified 是mongoose 里的Document.prototype.isModified()
    if (!this.isModified("password")) {
      next();
    }
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });

//  可供 查询出的user对象 调用的方法
UserSchema.methods.matchPassword = async function (password) {
    // 返回的查询user对象 等于this
    return await bcrypt.compare(password, this.password);
};  

UserSchema.methods.getSignedJwtToken = function () {
    // 生成JWT_SECRET   命令行node 模式  输入require('crypto').randomBytes(35).toString("hex")  创建
    //                    this 指向 调用该方法的user对象
    // 拿user._id 和 JWT_SECRET 编码
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
};

UserSchema.methods.getResetPasswordToken = function () {
    // randomly generate a reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    // 创建一个Hash token (private key) and save to 该user的resetPasswordToken 字段
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    // Set token expire date
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // Ten Minutes
  
    return resetToken;
  };

const User = mongoose.model("User", UserSchema);

module.exports = User;
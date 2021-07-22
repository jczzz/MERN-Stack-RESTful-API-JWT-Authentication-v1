const User = require('../models/User');
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

exports.register = async (req, res, next) => {
    // extract from the body    because we set the middleware express.json() in server.js
    // 
    const {username, email, password} = req.body;
    

    try {
        // User.create 是promise-based 异步函数
        const user = await User.create({
        username,
        email,
        password,
        });

        // res.status(201).json({
        //     success:true,
        //     user,
        // })
        
        // 生成token，返回
        sendToken(user,200,res)
    } catch (error) {
        // res.status(500).json({
        //     success:true,
        //     error: error.message,
        // })
        next(error);
    }
    // res.send("register route");
}

// set this fuction equal to asynchronous 
exports.login = async (req, res, next) => {
    const {email, password} = req.body;

    // check this on the front end as well
    if(!email || ! password) {
       // res.status(400).json({ success: false, error: "please provide email and password"})
       return next(new ErrorResponse("Please provide an email and password", 400));
    }

    try {
        // Check that user exists by email
        const user = await User.findOne({ email }).select("+password"); // populating the password field

        if (!user) {
           // res.status(400).json({ success: false, error: "invalid credentials"})
           return next(new ErrorResponse("Invalid credentials", 401));
          }
      
        // Check that password match
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            // res.status(400).json({ success: false, error: "invalid credentials"})
            return next(new ErrorResponse("Invalid credentials", 401));
        }

        // res.status(200).json({
        //     success:true,
        //     token: "faf32r23f2qf2q"
        // })
        // 生成token，返回
        sendToken(user,200,res)
    } catch(error) {
        // res.status(500).json({
        //     success:true,
        //     error: error.message,
        // })
        console.log('这里吗');
        next(error);
    }


    // res.send("log in route")
}

exports.forgotpassword = async (req, res, next) => {
    // Send Email to email provided but first check if user exists
  const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
        return next(new ErrorResponse("No email could not be sent", 404));
        }

        // Reset Token Generated and add to user database hashed (private) version of this token
        const resetToken = user.getResetPasswordToken();
        await user.save();

        // Create reset url to email to provided email
        const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`;

        // HTML Message
        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please make a put request to the following link:</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `;

        try {
            await sendEmail({
            to: user.email,
            subject: "Password Reset Request",
            text: message,
            });

        res.status(200).json({ success: true, data: "Email Sent" });

        }catch (err){
            console.log(err);

            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
    
            await user.save();
    
            return next(new ErrorResponse("Email could not be sent", 500));
        }

    } catch (err) {
        next(err);
    }

}


//  Reset User Password
exports.resetpassword = async (req, res, next) => {
    // Compare token in URL params to hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");
      
    console.log(resetPasswordToken)
    try {
      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
      });
  
      if (!user) {
        return next(new ErrorResponse("Invalid Token", 400));
      }
  
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
  
      await user.save();
  
      res.status(201).json({
        success: true,
        data: "Password Updated Success",
        token: user.getSignedJwtToken(),
      });
    } catch (err) {
      next(err);
    }
  };




const sendToken = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    res.status(statusCode).json({ sucess: true, token });
  };
const express = require('express');
const { register, login, forgotpassword, resetpassword } = require('../controllers/auth');
const router = express.Router();




// 另一种写法：router.route("/register").post(register);
router.post("/register",register );

router.post("/login", login);

router.post("/forgotpassword", forgotpassword);

router.put("/resetpassword/:resetToken", resetpassword);



module.exports = router;
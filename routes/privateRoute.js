const express = require("express");
const router = express.Router();
const { getPrivateRoute } = require("../controllers/privateRoute");
const { isAuth } = require("../middleware/isAuth");



// 中间件isAuth 检验权限
router.get("/", isAuth, getPrivateRoute);

module.exports = router;

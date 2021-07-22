const mongoose = require("mongoose");

const connectDB = async () => {
    // mongoose.connect  也是一个异步函数 promise-based,  省略接收返回值(promise对象)
  await mongoose.connect(process.env.DATABASE_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  });

  console.log("MongoDB Connected");
};

module.exports = connectDB;

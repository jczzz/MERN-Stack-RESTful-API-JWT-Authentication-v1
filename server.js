require('dotenv').config({path:"./config.env"});
const express = require('express');
const connectDB = require("./config/db");

const authRouter = require('./routes/auth');
const privateRouter = require('./routes/privateRoute')
const errorHandler = require("./middleware/errorHandler");

const app = express();
connectDB();


// allow to get data from the request.body
app.use(express.json());

app.use('/api/auth', authRouter)
app.use('/api/private', privateRouter)

// Error Handler Middleware   (should be last piece of middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// server avaiable
const server = app.listen(PORT, ()=>console.log(`server is running on port ${PORT}`));

// anywhere 'unhandleRejection' event 发生, run this callback 处理，  比如： 在db.js中，mongoose.connect（）可能会有promise -> reject
// this function has access to the error variable
process.on("unhandledRejection", (err, promise) => {
    console.log(`Logged Error: ${err.message}`);
    // stop server 
    server.close(() => process.exit(1));
  });
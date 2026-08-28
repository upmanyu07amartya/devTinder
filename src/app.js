const express = require("express");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const { authRouter } = require("./router/auth");
const { profileRouter } = require("./router/profile");
const { requestRouter } = require("./router/request");
const { userRouter } = require("./router/user")


const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


// Connected to DB and only on successful connection we start the server
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server is running on PORT 3000");
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
  });

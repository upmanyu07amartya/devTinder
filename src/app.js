const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Amartya",
    lastName: "Upmanyu",
    email: "amartyaupmanyu@gmail.com",
    password: "123456",
  });
  try {
    await user.save();    // create a new user instance and save it to the database
    res.send("User created Successfully");
  } catch (err) {
    res.status(500).send("Error creating user");
  }
});

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

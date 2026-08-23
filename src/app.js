const express = require("express");
const bcrypt = require("bcrypt");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const { validateSignup } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies

app.post("/signup", async (req, res) => {
  try {
    // validate the request
    validateSignup(req);
    // encrypt the password
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10); //brypt.hash returns a promise to awaiting promise

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    }); // create a new user instance with the request body data

    if (req.body.skills?.length > 10) {
      throw new Error("Skills should not be more than 10");
    }
    await user.save(); // save it to the database
    res.send("User created Successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordCorrect = await user.comparePass(password);
    if (isPasswordCorrect) {
      // generate JWT
      const token = await user.getJWT();

      // Add JWT to cookie and send res back to user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login successful");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    if (!user) throw new Error("No details");

    res.send(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  res.send(req.user.firstName + " sent connection request");
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

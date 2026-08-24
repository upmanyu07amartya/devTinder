const express = require("express");
const authRouter = express.Router();
const { validateSignup } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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

module.exports = { authRouter };

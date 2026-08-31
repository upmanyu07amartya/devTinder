const express = require("express");
const authRouter = express.Router();
const { validateSignup } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const USER_SAFE_DATA = [
  "firstName",
  "lastName",
  "email",
  "age",
  "description",
  "profileImageUrl",
  "skills",
  "gender",
  "_id",
];

authRouter.post("/signup", async (req, res) => {
  try {
    // validate the request
    validateSignup(req);
    // encrypt the password
    const {
      firstName,
      lastName,
      email,
      password,
      age,
      gender,
      description,
      profileImageUrl,
      skills,
    } = req.body;
    const passwordHash = await bcrypt.hash(password, 10); //brypt.hash returns a promise to awaiting promise
    const finalProfileImageUrl =
      profileImageUrl ||
      "https://cdn.vectorstock.com/i/500p/54/17/faceless-man-placeholder-vector-24005417.jpg";

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      age,
      gender,
      description,
      profileImageUrl: finalProfileImageUrl,
      skills,
    }); // create a new user instance with the request body data

    const token = await user.getJWT();

    // Add JWT to cookie and send res back to user
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    const savedUser = await user.save(); // save it to the database
    const safeData = Object.fromEntries(
      USER_SAFE_DATA.map((field) => [field, savedUser[field]]),
    );

    res.json({ message: "User created Successfully", data: safeData });
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
      const safeData = Object.fromEntries(
        USER_SAFE_DATA.map((field) => [field, user[field]]),
      );

      res.json({ message: "Login successful", data: safeData });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("You were logged out successfully!!");
});

module.exports = { authRouter };

const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditData, validatePassword } = require("../utils/validation");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    if (!user) throw new Error("No details");

    res.json({data: user});
  } catch (err) {
    res.status(500).send(err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    // validate data i.e only allowed fields can be editied.
    if (!validateEditData(req)) throw new Error("Invalid edit request");
    if (req.body.skills?.length > 10) {
      throw new Error("Skills should not be more than 10");
    }
    const loggedInUser = req.user;
    //this is something like - loggedInUser.firstName = req.body.firstName... for all fields
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your profile was updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

profileRouter.patch("/profile/editPassword", userAuth, async (req, res) => {
  try {
    await validatePassword(req);
    const { newPassword } = req.body;
    const loggedInUser = req.user;

    // if(matched) - hash new password and store new hash in db
    const passwordHash = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = passwordHash;
    loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your password was updated succesfully`,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = { profileRouter };

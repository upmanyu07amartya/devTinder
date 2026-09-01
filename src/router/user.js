const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
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
];

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA); // this is used to make use of refs
    if (connectionRequests.length === 0) {
      return res.json({ message: "No requests found", data: [] });
    }
    res.json({
      message: "Connection Requests found",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    if (connections.length === 0){ return res.json({ message: "No Connections Found", data: [] })};
    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }

      return row.fromUserId;
    });
    res.json({ message: "Connections Found", data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    // get All connection requests involving the loggedIn user

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    // construct a unique set of users that should be hidden
    const usersToHide = new Set();
    connectionRequests.forEach((req) => {
      usersToHide.add(req.fromUserId.toString());
      usersToHide.add(req.toUserId.toString());
    });

    //get user info to show.

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(usersToHide) } }, // this will actually omit the loggedinuser id (which is correct btw)
        { _id: { $ne: loggedInUser._id } }, // this is in case if loggedinuser has never sent or received a connection request
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = { userRouter };

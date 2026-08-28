const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const USER_SAFE_DATA = [
  "firstName",
  "lastName",
  "age",
  "description",
  "profileImageUrl",
  "skills",
];

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA); // this is used to make use of refs
    if (connectionRequests.length === 0) {
      res.json({ message: "No requests found", data: [] });
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
    if (connections.length === 0)
      res.json({ message: "No Connections Found", data: [] });
    const data = connections.map((row) => {
      if (row.fromUserId.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }

      return row.fromUserId;
    });
    res.json({ message: "Connections Found", data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = { userRouter };

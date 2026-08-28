const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to User collection
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is not supported.`,
      },
    },
  },
  {
    timestamps: true,
  },
);

//compound index
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function () {
  // check if from and to user ID are same;
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("Cannot send connection request to self!!!!!");
  }
});

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequestModel",
  connectionRequestSchema,
);

module.exports = ConnectionRequestModel;

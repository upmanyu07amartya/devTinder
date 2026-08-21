const {mongoose} = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Password must be at least 6 characters long"],
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender data is not correct");
        }
      },
    },
    description: {
      type: String,
      default: "This is the default description, you can change it later",
    },
    profileImageUrl: {
      type: String,
      default: "https://www.vecteezy.com/free-vector/profile-placeholder",
    },
    skills:{
        type:[String],
    }
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User",userSchema);

module.exports = User;
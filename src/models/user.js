const { mongoose } = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Entered email is not valid- " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 6, //can use a validator isStrongPassword.
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
      default:
        "https://cdn.vectorstock.com/i/500p/54/17/faceless-man-placeholder-vector-24005417.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Please enter a valid url");
        }
      },
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.comparePass = async function (password) {
  const user = this;
  const compared = await bcrypt.compare(password, user.password);
  return compared;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

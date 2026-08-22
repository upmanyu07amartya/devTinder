const {mongoose} = require("mongoose");
const validator  = require("validator");

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
      validate(value){
        if(!validator.isEmail(value)){
            throw new Error("Entered email is not valid- "+value);
        }

      }
    },
    password: {
      type: String,
      required: true,
      minLength: 6    //can use a validator isStrongPassword.
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
      validate(value){
        if(!validator.isURL(value)){
            throw new Error("Please enter a valid url")
        }
      }
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
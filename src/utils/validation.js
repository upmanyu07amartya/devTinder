const validator = require("validator");

const validateSignup = (request) => {
  const { firstName, email, password, lastName } = request.body;
  if (!firstName || !lastName) {
    throw new Error("FirstName and LastName are required");
  }
  if (firstName.length < 3) {
    throw new Error("First name should atleast be 3 characters");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Please enter a valid Email");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

const validateEditData = (req) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "description",
    "profileImageUrl",
    "skills",
  ];
  const isAllowedEdit = Object.keys(req.body).every((key) =>
    allowedFields.includes(key),
  );
  return isAllowedEdit;
};

const validatePassword = async (req) => {
  const loggedInUser = req.user;
  const { oldPassword, newPassword } = req.body;

  // compare old pass with loggedIn users password hash

  const isPasswordMatched = await loggedInUser.comparePass(oldPassword);
  if (!isPasswordMatched) throw new Error("Invalid Old Password");

  //check if new pass is a strong password;
  if (!validator.isStrongPassword(newPassword)) {
    throw new Error("Please enter a strong new password");
  }
};

module.exports = { validateSignup, validateEditData, validatePassword };

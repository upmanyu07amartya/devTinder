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

module.exports = { validateSignup };

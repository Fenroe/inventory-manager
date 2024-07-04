const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // validation
    if (!name || !email || !password) {
      throw new Error("Please fill in all required fields");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
    // check if user email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("Email has already been registered");
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    if (user) {
      const { _id, name, email, photo, phone, bio } = user;
      res.status(201).json({
        _id,
        name,
        email,
        photo,
        phone,
        bio,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
};

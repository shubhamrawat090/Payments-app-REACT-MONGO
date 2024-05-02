const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  firstName: {
    type: String,
    required: true,
    maxLength: 50,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    maxLength: 50,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
});

// User Model
const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};

const mongoose = require("mongoose");
const enums = require("../helper/enum");
const userschema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  otp_update_time: {
    type: Date,
    default: Date.now(),
  },
  is_verified: {
    type: String,
    default: enums.enum_status[1],
  },
  role: {
    type: String,
    default: "user",
  },
  blocked: {
    type: String,
    default: enums.enum_status[1],
  },
  created_time: {
    type: Date,
    default: Date.now(),
  },
  wallet: {
    type: Number,
    default: 0,
  },
  profile_picture: {
    type: String,
  },
});

module.exports = mongoose.model("usercollection", userschema);

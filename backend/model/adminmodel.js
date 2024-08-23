const mongoose = require("mongoose");

const adminschema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "admin",
  },
  payOut: {
    type: Number,
    default: 100,
  },
});

module.exports = mongoose.model("admincollection", adminschema);

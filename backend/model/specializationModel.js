const mongoose = require("mongoose");

const specializationSchema = new mongoose.Schema({
  specialization: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model(
  "specializationCollection",
  specializationSchema
);

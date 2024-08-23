const mongoose = require("mongoose");

const slotschema = new mongoose.Schema({
  docId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctorcollection",
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  booked: {
    type: Boolean,
    default: false,
  },
  // bookedUserId:{
  //     type:mongoose.Schema.Types.ObjectId,
  //     ref:'usercollection',
  //     // required:true
  // },
  bookingAmount: {
    type: Number,
    required: true,
  },
  adminPaymentAmount: {
    type: Number,
    required: true,
  },
  cancelled: {
    type: Boolean,
    default: false,
  },
  created_time: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("slotcollection", slotschema);

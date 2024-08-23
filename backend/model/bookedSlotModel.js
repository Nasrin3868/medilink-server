const mongoose = require("mongoose");

const bookedSlotSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "usercollection",
    required: true,
  },
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "slotcollection",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctorcollection",
    required: true,
  },
  payment_method: {
    type: String,
    required: true,
  },
  payment_status: {
    type: Boolean,
    default: false,
  },
  consultation_status: {
    type: String,
    default: "pending",
  },
  patient_details: {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
    address: {
      type: String,
    },
    reason_for_visit: {
      type: String,
    },
  },
  created_time: {
    type: Date,
    default: Date.now(),
  },
  roomId: {
    type: String,
  },
  prescription_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "prescriptionCollection"
  }
});

module.exports = mongoose.model("bookedCollection", bookedSlotSchema);

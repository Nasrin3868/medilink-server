const mongoose = require("mongoose");
const enums = require("../helper/enum");

const doctorschema = new mongoose.Schema({
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
  contactno: {
    type: Number,
    required: true,
  },
  profile_picture:{
    type:String,
    required:true
  },
  specialization: {
    type: String,
    required: true,
  },
  current_working_hospital_address: {
    type: String,
    require: true,
  },
  experience: {
    type: String,
    required: true,
  },
  consultation_fee: {
    type: Number,
    required: true,
  },
  qualification_certificate: [
    {
      type: String,
      required: true,
    },
  ],
  experience_certificate: [
    {
      type: String,
      required: true,
    },
  ],
  doctors_liscence: {
    type: String,
    required: true,
  },
  identity_proof_type: {
    type: String,
    required: true,
  },
  identity_proof: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  kyc_verification: {
    type: String,
    default: enums.enum_status[1],
  },
  blocked: {
    type: String,
    default: enums.enum_status[1],
  },
  created_time: {
    type: Date,
    default: Date.now(),
  },
  otp: {
    type: Number,
    required: true,
  },
  otp_update_time: {
    type: Date,
    default: Date.now(),
  },
  otp_verification:{
    type:Boolean,
    default:false
  },
  profile_picture: {
    type: String,
  },
});

module.exports = mongoose.model("doctorcollection", doctorschema);

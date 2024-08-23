const mongoose = require("mongoose");
const enums = require("../helper/enum");

const docKycschema = new mongoose.Schema({
  docId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctorcollection",
    required: true,
  },
  exp_certificate: {
    type: String,
    default: enums.enum_for_kyc_verification[1],
  },
  qualification_certificate: {
    type: String,
    default: enums.enum_for_kyc_verification[1],
  },
  doc_liscence: {
    type: String,
    default: enums.enum_for_kyc_verification[1],
  },
  id_proof_type: {
    type: String,
    default: enums.enum_for_kyc_verification[1],
  },
  id_proof: {
    type: String,
    default: enums.enum_for_kyc_verification[1],
  },
  specialization: {
    type: String,
    default: enums.enum_for_kyc_verification[1],
  },
  curr_work_hosp: {
    type: String,
    default: enums.enum_for_kyc_verification[1],
  },
  created_time: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("docKyccollection", docKycschema);

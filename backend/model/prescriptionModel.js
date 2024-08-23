const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    bookedSlot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bookedCollection",
      required: true,
    },
    disease: {
      type: String,
      required: true,
    },
    prescription: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("prescriptionCollection", prescriptionSchema);

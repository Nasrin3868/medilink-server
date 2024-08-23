const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "senderModel",
    },
    senderModel: {
      type: String,
      required: true,
      enum: ["usercollection", "doctorcollection"], // Using usercollection and doctorcollection as references
    },
    content: {
      type: String,
      required: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chatCollection",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("messageCollection", messageSchema);

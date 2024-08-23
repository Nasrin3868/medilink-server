const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", true);

const connectToDatabase = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/MediLink", {})
    .then(() => {
      console.log("Database Connected");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { connectToDatabase };

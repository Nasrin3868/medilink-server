const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", true);

const connectToDatabase = () => {
  mongoose
    .connect(process.env.mongodb_url, {})
    .then(() => {
      console.log("Database Connected");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { connectToDatabase };

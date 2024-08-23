const doctorCollection = require("../model/doctormodel");
const userCollection = require("../model/usermodel");

const findSenderModel = async (id) => {
  const user = await userCollection.findById(id);
  if (user) {
    console.log("sender is from usercollection");
    return "usercollection";
  }
  const doctor = await doctorCollection.findById(id);
  if (doctor) {
    console.log("sender is from doctorcollection");
    return "doctorcollection";
  }
  return null;
};

module.exports = {
  findSenderModel,
};

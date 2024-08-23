const jwt = require("jsonwebtoken");
const Doctor = require("../model/doctormodel");

// user token authentication middleware
const doctorAuth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("doctor-Bearer")) {
    const token = authHeader.split(" ")[1]; // Getting token from the header
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_TOKEN,
        (err, doctor) => {
          console.log("doctor:", doctor);
          if (err) {
            res.status(401).json({ message: "Unauthorized" });
          } else {
            req.doctorId = doctor.doctorId;
            next();
          }
        }
      );
    } catch (error) {
      res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

const checkDoctorBlocked = async (req, res, next) => {
  try {
    const doctorId = req.doctorId; // Assuming the user ID is stored in req.user
    const doctor = await Doctor.findById(doctorId);
    if (doctor && doctor.blocked === "true") {
      return res.status(403).json({ message: "Doctor is blocked" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { doctorAuth, checkDoctorBlocked };

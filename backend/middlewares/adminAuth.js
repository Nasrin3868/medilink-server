const jwt = require("jsonwebtoken");

// user token authentication middleware

const adminAuth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("admin-Bearer")) {
    const token = authHeader.split(" ")[1]; // Getting token from the header

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_TOKEN,
        (err, admin) => {
          console.log(admin);
          if (err) {
            console.log("err:", err);
            res.status(401).json({ message: "Unauthorized" });
          } else {
            req.adminId = admin.adminId;
            console.log(admin);
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

module.exports = adminAuth;

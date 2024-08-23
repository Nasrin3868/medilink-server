const jwt = require("jsonwebtoken");
const userCollection = require("../model/usermodel");

// user token authentication middleware

const userAuth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("user-Bearer")) {
    const token = authHeader.split(" ")[1]; // Getting token from the header

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_TOKEN,
        (err, user) => {
          console.log(user);
          if (err) {
            console.log("err:", err);
            res.status(401).json({ message: "Unauthorized" });
          } else {
            req.userId = user.userId;
            console.log(user);
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

const checkUserBlocked = async (req, res, next) => {
  try {
    const userId = req.userId; // Assuming the user ID is stored in req.user
    const user = await userCollection.findById(userId);

    if (user && user.blocked === "true") {
      return res.status(403).json({ message: "User is blocked" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { userAuth, checkUserBlocked };

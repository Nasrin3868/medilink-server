const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("file received while reg doc:", file.originalname);
    
    cb(null, "images/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
    // cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;

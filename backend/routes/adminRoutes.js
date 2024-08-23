const express = require("express");
const adminController = require("../controller/admincontroller");
const router = express.Router();
const adminAuth = require("../middlewares/adminAuth");

router.post("/adminLogin", adminController.adminLogin);
router.get("/doctordata", adminController.doctordata);
router.post("/doctorBlock", adminController.doctorBlock);
router.get("/userdata", adminController.userdata);
router.post("/userBlock", adminController.userBlock);
router.post("/userDetails", adminController.userDetails);
router.get("/kycDataCollection", adminController.kycDataCollection);
router.post("/searchUser", adminController.searchUser);
router.get("/getSpecialization", adminController.getSpecialization);
router.post("/addSpecialization", adminController.addSpecialization);
router.post("/editSpecialization", adminController.editSpecialization);
router.delete("/deleteSpecialization", adminController.deleteSpecialization);
router.post("/editpayOut", adminController.editpayOut);
router.get(
  "/get_kyc_details_of_doctor",
  adminController.get_kyc_details_of_doctor
);
router.post("/submit_kyc_details", adminController.submit_kyc_details);
router.get("/download_kyc_documents", adminController.download_kyc_documents);
router.get("/get_appointment_details", adminController.get_appointment_details);
router.get(
  "/get_admin_dashboard_details",
  adminController.get_admin_dashboard_details
);

module.exports = router;

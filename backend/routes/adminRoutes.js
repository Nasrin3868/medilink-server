const express = require("express");
const adminController = require("../controller/admincontroller");
const router = express.Router();
const adminAuth = require("../middlewares/adminAuth");

router.post("/adminLogin", adminController.adminLogin);
router.use(adminAuth)
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
  "/getKycDetailsOfDoctor",
  adminController.getKycDetailsOfDoctor
);
router.post("/submitKycDetails", adminController.submitKycDetails);
router.get("/downloadKycDocuments", adminController.downloadKycDocuments);
router.get("/getAppointmentDetails", adminController.getAppointmentDetails);
router.get(
  "/getAdminDashboardDetails",
  adminController.getAdminDashboardDetails
);

module.exports = router;

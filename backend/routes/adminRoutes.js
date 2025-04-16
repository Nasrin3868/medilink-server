const express = require("express");
const adminController = require("../controller/admincontroller");
const router = express.Router();
const adminAuth = require("../middlewares/adminAuth");

router.post("/adminLogin", adminController.adminLogin);
router.use(adminAuth)
router.get("/doctordata", adminController.doctordata);
router.post("/doctorBlock", adminController.doctorBlock);
router.get("/userdata", adminController.userdata);
router.patch("/userBlock", adminController.userBlock);
router.post("/userDetails", adminController.userDetails);
router.get("/kycDataCollection", adminController.kycDataCollection);
router.post("/searchUser", adminController.searchUser);
router.get("/getSpecialization", adminController.getSpecialization);
router.post("/addSpecialization", adminController.addSpecialization);
router.patch("/editSpecialization", adminController.editSpecialization);
router.delete("/deleteSpecialization", adminController.deleteSpecialization);
router.patch("/editpayOut", adminController.editpayOut);
router.get(
  "/getKycDetailsOfDoctor",
  adminController.getKycDetailsOfDoctor
);
router.put("/submitKycDetails", adminController.submitKycDetails);
router.get("/downloadKycDocuments", adminController.downloadKycDocuments);
router.get("/getAppointmentDetails", adminController.getAppointmentDetails);
router.get(
  "/getAdminDashboardDetails",
  adminController.getAdminDashboardDetails
);

module.exports = router;

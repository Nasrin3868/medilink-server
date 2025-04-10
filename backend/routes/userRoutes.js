const express = require("express");
const usercontroller = require("../controller/usercontroller");
const chatController = require("../controller/chatcontroller");
const { userAuth, checkUserBlocked } = require("../middlewares/userAuth");
const router = express.Router();

router.post("/userRegister", usercontroller.registerUser);
router.post("/resendOtp", usercontroller.resendOtp);
router.post("/verifyOtp", usercontroller.verifyOtp);
router.post("/verifyEmail", usercontroller.verifyEmail);
router.post("/updatePassword", usercontroller.updatePassword);
router.post("/login", usercontroller.userLogin);
router.use(checkUserBlocked, userAuth);
router.get("/getuserDetails", usercontroller.getuserDetails);

router.post("/editUserProfile", usercontroller.editUserProfile);

router.get("/getSpecialization", usercontroller.getSpecialization);
router.get("/getDocotrs", usercontroller.getDocotrs);

router.get("/getSlot", usercontroller.getSlot);
router.get("/getDoctorDetails", usercontroller.getDoctorDetails);
router.get("/getSlots", usercontroller.getSlots);
router.post("/addSlots", usercontroller.addSlots);
router.get(
  "/checkIfTheSlotAvailable",
  usercontroller.checkIfTheSlotAvailable
);
//payment
router.post("/bookingPayment", usercontroller.bookingPayment);
router.post("/appointmnet_booking", usercontroller.appointmnet_booking);
router.get("/userDetails", usercontroller.userDetails);
router.get("/getBookingDetails", usercontroller.getBookingDetails);
router.get("/cancelSlot", usercontroller.cancelSlot);

//chat
router.get("/userAccessChat", chatController.userAccessChat);
router.get("/userFetchAllChat", chatController.userFetchAllChat);
router.post("/sendMessage", chatController.sendMessage);
router.get("/userFetchAllMessages", chatController.userFetchAllMessages);

router.get("/upcomingAppointment", usercontroller.upcomingAppointment);
router.get("/getUpcomingSlot", usercontroller.getUpcomingSlot);
// router.get("/addPrescription", usercontroller.addPrescription);
router.get(
  "/getPrescriptionDetails",
  usercontroller.getPrescriptionDetails
);
router.get("/prescriptionDetails", usercontroller.prescriptionDetails);
router.post("/editUserProfileName", usercontroller.editUserProfileName);
router.post("/optForNewEmail", usercontroller.optForNewEmail);
router.post(
  "/editUserProfilePicture",
  usercontroller.editUserProfilePicture
);

module.exports = router;

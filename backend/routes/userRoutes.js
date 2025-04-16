const express = require("express");
const usercontroller = require("../controller/usercontroller");
const chatController = require("../controller/chatcontroller");
const { userAuth, checkUserBlocked } = require("../middlewares/userAuth");
const router = express.Router();

router.post("/userRegister", usercontroller.registerUser);
router.patch("/resendOtp", usercontroller.resendOtp);
router.patch("/verifyOtp", usercontroller.verifyOtp);
router.patch("/verifyEmail", usercontroller.verifyEmail);
router.patch("/updatePassword", usercontroller.updatePassword);
router.post("/login", usercontroller.userLogin);
// router.use((req, res, next) => {
//   console.log('Route hit before refresh token:', req.originalUrl);
//   next();
// });
// router.post("/refresh_token",usercontroller.refreshToken)

router.use(checkUserBlocked, userAuth);
// router.use((req, res, next) => {
//   console.log('Route hit after refresh token:', req.originalUrl);
//   next();
// });
router.get("/getuserDetails", usercontroller.getuserDetails);

router.patch("/editUserProfile", usercontroller.editUserProfile);

router.get("/getSpecialization", usercontroller.getSpecialization);
router.get("/getDocotrs", usercontroller.getDocotrs);

router.get("/getSlot", usercontroller.getSlot);
router.get("/getDoctorDetails", usercontroller.getDoctorDetails);
router.get("/getSlots", usercontroller.getSlots);
router.patch("/addSlots", usercontroller.addSlots);
router.get(
  "/checkIfTheSlotAvailable",
  usercontroller.checkIfTheSlotAvailable
);
//payment
router.post("/bookingPayment", usercontroller.bookingPayment);
router.post("/appointmnet_booking", usercontroller.appointmnet_booking);
router.get("/userDetails", usercontroller.userDetails);
router.get("/getBookingDetails", usercontroller.getBookingDetails);
router.patch("/cancelSlot", usercontroller.cancelSlot);

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
router.patch("/editUserProfileName", usercontroller.editUserProfileName);
router.patch("/optForNewEmail", usercontroller.optForNewEmail);
router.patch(
  "/editUserProfilePicture",
  usercontroller.editUserProfilePicture
);
// router.post("/logout",usercontroller.logOut)

module.exports = router;

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
router.get(
  "/getuserDetails",
  userAuth,
  checkUserBlocked,
  usercontroller.getuserDetails
);
router.post(
  "/editUserProfile",
  userAuth,
  checkUserBlocked,
  usercontroller.editUserProfile
);
router.get("/getSpecialization", usercontroller.getSpecialization);
router.get("/getDocotrs", usercontroller.getDocotrs);
router.get(
  "/getDoctorDetails",
  userAuth,
  checkUserBlocked,
  usercontroller.getDoctorDetails
);
router.get("/getSlots", userAuth, checkUserBlocked, usercontroller.getSlots);
router.post("/addSlots", userAuth, checkUserBlocked, usercontroller.addSlots);
router.get("/getSlot", userAuth, usercontroller.getSlot);
router.get(
  "/check_if_the_slot_available",
  userAuth,
  checkUserBlocked,
  usercontroller.check_if_the_slot_available
);
router.use(checkUserBlocked);
//payment
router.post("/booking_payment", usercontroller.booking_payment);
router.post("/appointmnet_booking", usercontroller.appointmnet_booking);
router.get("/userDetails", usercontroller.userDetails);
router.get("/get_booking_details", usercontroller.get_booking_details);
router.get("/cancelSlot", usercontroller.cancelSlot);

//chat
router.get("/userAccessChat", chatController.userAccessChat);
router.get("/userFetchAllChat", chatController.userFetchAllChat);
router.post("/sendMessage", chatController.sendMessage);
router.get("/userFetchAllMessages", chatController.userFetchAllMessages);

router.get("/upcoming_appointment", usercontroller.upcoming_appointment);
router.get("/getUpcomingSlot", usercontroller.getUpcomingSlot);
// router.get("/add_prescription", usercontroller.add_prescription);
router.get("/get_prescription_details",usercontroller.get_prescription_details)

router.post("/editUserProfile_name",usercontroller.editUserProfile_name)
router.post("/opt_for_new_email",usercontroller.opt_for_new_email)
router.get("/edit_user_profile_picture",usercontroller.edit_user_profile_picture)

module.exports = router;

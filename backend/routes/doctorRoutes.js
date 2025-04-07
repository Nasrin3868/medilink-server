const express = require("express");
const doctorController = require("../controller/doctorcontroller");
const chatController = require("../controller/chatcontroller");
const { doctorAuth, checkDoctorBlocked } = require("../middlewares/doctorAuth");
const router = express.Router();
const uploads = require("../helper/multer");

router.post(
  "/registration",
  uploads.fields([
    { name: "identity_proof", maxCount: 1 },
    { name: "doctors_liscence", maxCount: 1 },
    {name:'profile_picture', maxCount: 1 },
    { name: "qualification_certificate" },
    { name: "experience_certificate" },
  ]),
  doctorController.doctorRegistration
);
router.get("/getSpecialization", doctorController.getSpecialization);
router.post("/resendOtp", doctorController.resendOtp);
router.post("/verifyOtp", doctorController.verifyOtp);
router.post("/login", doctorController.doctorLogin);
router.post("/verifyEmail", doctorController.verifyEmail);
router.post("/updatePassword", doctorController.updatePassword);
router.get(
  "/getDoctorDetails",
  doctorAuth,
  checkDoctorBlocked,
  doctorController.getDoctorDetails
);
router.post(
  "/editDoctorProfile",
  doctorAuth,
  checkDoctorBlocked,
  doctorController.editDoctorProfile
);
router.post(
  "/edit_doctor_profile_picture",
  doctorAuth,
  checkDoctorBlocked,
  doctorController.edit_doctor_profile_picture
);
router.post(
  "/opt_for_new_email",
  doctorAuth,
  checkDoctorBlocked,
  doctorController.opt_for_new_email
);

router.post(
  "/slotCreation",
  doctorAuth,
  checkDoctorBlocked,
  doctorController.slotCreation
);
router.post(
  "/add_all_slots",
  // doctorAuth,
  // checkDoctorBlocked,
  doctorController.add_all_slots
);
router.get(
  "/doctorSlotDetails",
  doctorAuth,
  checkDoctorBlocked,
  doctorController.doctorSlotDetails
);
router.delete(
  "/RemoveSlot",
  doctorAuth,
  checkDoctorBlocked,
  doctorController.RemoveSlot
);
router.get(
  "/get_booking_details",
  checkDoctorBlocked,
  doctorAuth,
  doctorController.get_booking_details
);
router.get(
  "/get_bookings_of_doctor",
  checkDoctorBlocked,
  doctorAuth,
  doctorController.get_bookings_of_doctor
);

//chat
router.get(
  "/doctor_accessed_chats",
  doctorAuth,
  checkDoctorBlocked,
  chatController.doctor_accessed_chats
);
router.get(
  "/doctorFetchAllMessages",
  doctorAuth,
  checkDoctorBlocked,
  chatController.doctorFetchAllMessages
);
router.post("/doctorSendMessage", chatController.doctorSendMessage);

router.get(
  "/upcoming_appointment",
  doctorAuth,
  checkDoctorBlocked,
  doctorController.upcoming_appointment
);
router.get(
  "/updateUpcomingSlot",
  doctorAuth,
  checkDoctorBlocked,
  doctorController.updateUpcomingSlot
);
router.get(
  "/update_consultationStatus",
  doctorAuth,
  checkDoctorBlocked,
  doctorController.update_consultationStatus
);

router.get(
  "/add_prescription",
  doctorAuth,
  checkDoctorBlocked,
  doctorAuth,
  doctorController.add_prescription
);
router.get(
  "/prescriptionDetails",
  doctorAuth,
  doctorController.prescriptionDetails
)
router.get(
  "/get_doctor_dashboard_details",
  doctorAuth,
  checkDoctorBlocked,
  doctorAuth,
  doctorController.get_doctor_dashboard_details
);
router.get(
  "/share_roomId_through_email",
  doctorAuth,
  checkDoctorBlocked,
  doctorAuth,
  doctorController.share_roomId_through_email
);


module.exports = router;

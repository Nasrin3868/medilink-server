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
    { name: "profile_picture", maxCount: 1 },
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

router.use(doctorAuth, checkDoctorBlocked);

router.get("/getDoctorDetails", doctorController.getDoctorDetails);
router.post("/editDoctorProfile", doctorController.editDoctorProfile);
router.post(
  "/editDoctorProfilePicture",
  doctorController.editDoctorProfilePicture
);
router.post("/optForNewEmail", doctorController.optForNewEmail);

router.post("/slotCreation", doctorController.slotCreation);
router.post("/addAllSlots", doctorController.addAllSlots);
router.get("/doctorSlotDetails", doctorController.doctorSlotDetails);
router.delete("/RemoveSlot", doctorController.RemoveSlot);
router.get("/getBookingDetails", doctorController.getBookingDetails);
router.get("/getBookingsOfDoctor", doctorController.getBookingsOfDoctor);

//chat
router.get("/doctorAccessedChats", chatController.doctorAccessedChats);
router.get("/doctorFetchAllMessages", chatController.doctorFetchAllMessages);
router.post("/doctorSendMessage", chatController.doctorSendMessage);

router.get("/upcomingAppointment", doctorController.upcomingAppointment);
router.get("/updateUpcomingSlot", doctorController.updateUpcomingSlot);
router.get(
  "/updateConsultationStatus",
  doctorController.updateConsultationStatus
);

router.get("/addPrescription", doctorController.addPrescription);
router.get("/prescriptionDetails", doctorController.prescriptionDetails);
router.get(
  "/getDoctorDashboardDetails",
  doctorController.getDoctorDashboardDetails
);
router.get(
  "/shareRoomIdThroughEmail",
  doctorController.shareRoomIdThroughEmail
);

module.exports = router;

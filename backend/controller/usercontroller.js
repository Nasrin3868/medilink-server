const specCollection = require("../model/specializationModel");
const doctorCollection = require("../model/doctormodel");
const slotCollection = require("../model/slotModel");
const { hashedPass, comparePass } = require("../helper/hashPassword");
const { generateMail } = require("../helper/generateOtp");
const usercollection = require("../model/usermodel");
const bookedSlotCollection = require("../model/bookedSlotModel");
const jwt = require("jsonwebtoken");
const prescriptionCollection = require("../model/prescriptionModel");
const { check_the_file_is_an_image } = require("../helper/isPDF");
const { HttpStatusCodes } = require("../helper/enum");

const registerUser = async (req, res) => {
  console.log("register in userside");
  try {
    //validation of input
    const requiredFields = ["firstName", "lastName", "email", "password"];
    // console.log("req.body:", req.body);
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    } else {
      const { firstName, lastName, email, password } = req.body;
      // console.log(firstName, lastName, email, password);
      // const profile_pic = check_the_file_is_an_image(req.files['profile_pic'][0]);
      const user = await usercollection.findOne({ email });
      if (user === null) {
        const hashed_password = await hashedPass(password);
        const otp = await generateMail(email);
        const userdata = await usercollection.create({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: hashed_password,
          otp: otp,
          otp_update_time: new Date(),
        });
        res.status(HttpStatusCodes.CREATED).json({ message: "verify otp..." });
      } else {
        res
          .status(HttpStatusCodes.BAD_REQUEST)
          .json({ message: "Email Already Exists" });
      }
    }
  } catch (error) {
    console.log("register in userside error");
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server side error" });
  }
};

const resendOtp = async (req, res) => {
  try {
    console.log("user resent otp");
    //validation of input
    const requiredFields = ["email"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    } else {
      const { email } = req.body;
      const otp = await generateMail(email);
      const userdata = await usercollection.findOneAndUpdate(
        {
          email: email,
        },
        {
          $set: {
            otp: otp,
          },
          $currentDate: {
            otp_update_time: true,
          },
        }
      );
      if (userdata) {
        console.log("resented Otp:", otp);
        res
          .status(HttpStatusCodes.OK)
          .json({ message: "Successfully send a new OTP" });
      } else {
        res
          .status(HttpStatusCodes.NOT_FOUND)
          .json({ message: "User not found" });
      }
    }
  } catch (error) {
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    //validation of input
    const requiredFields = ["email", "otp"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    // console.log("missing fields:", missingFields);
    if (missingFields.length > 0) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    } else {
      const { email, otp } = req.body;
      // console.log(email, otp);
      const userdata = await usercollection.findOne({ email: email });
      // console.log("userdata:", userdata);
      if (userdata.otp !== Number(otp)) {
        // console.log(userdata.opt, Number(otp));
        res
          .status(HttpStatusCodes.UNAUTHORIZED)
          .json({ message: "Incorrect OTP" });
      } else {
        const otpExpiryMinute = 59;
        otpExpirySecond = otpExpiryMinute * 60;
        // checking the timer
        const timeDifference = Math.floor(
          (new Date() - userdata.otp_update_time) / 1000
        );
        if (timeDifference > otpExpirySecond) {
          console.log("otp expired");
          res
            .status(HttpStatusCodes.BAD_REQUEST)
            .json({ message: "Otp Expired" });
        } else {
          userdata.is_verified = true;
          if (req.body.role) {
            // console.log("role:", req.body.role);
            userdata.email = req.body.new_email;
          }
          await userdata.save();
          res
            .status(HttpStatusCodes.OK)
            .json({ message: "Account verified successfully." });
        }
      }
    }
  } catch (error) {
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

const userLogin = async (req, res) => {
  try {
    //validation of input
    const requiredFields = ["email", "password"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    } else {
      const { email, password } = req.body;
      const userdata = await usercollection.findOne({ email: email });
      if (userdata) {
        const password_match = await comparePass(password, userdata.password);
        if (password_match) {
          if (userdata.blocked === "true") {
            res
              .status(HttpStatusCodes.FORBIDDEN)
              .json({ message: "Your account is blocked by Admin" });
          } else if (userdata.is_verified === "false") {
            const otp = await generateMail(userdata.email);
            userdata.otp = otp;
            userdata.otp_update_time = new Date();
            await userdata.save();
            res.status(HttpStatusCodes.OK).json({
              email: email,
              message: "Complete OTP verification for Login",
            });
          } else {
            const data = {
              userId: userdata._id,
            };
            const accessToken = jwt.sign(data, process.env.JWT_ACCESS_TOKEN);
            const accessedUser = {
              _id: userdata._id,
              firstName: userdata.firstName,
              lastName: userdata.lastName,
              email: userdata.email,
              role: userdata.role,
            };
            res.status(HttpStatusCodes.OK).json({
              accessToken,
              accessedUser,
              message: "Login successfully",
            });
          }
        } else {
          res
            .status(HttpStatusCodes.UNAUTHORIZED)
            .json({ message: "Incorrect password" });
        }
      } else {
        res
          .status(HttpStatusCodes.UNAUTHORIZED)
          .json({ message: "Invalid username" });
      }
    }
  } catch (error) {
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

//verify email for forget password
const verifyEmail = async (req, res) => {
  try {
    //validation of input
    const requiredFields = ["email"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    } else {
      const { email } = req.body;
      const userdata = await usercollection.findOne({ email: email });
      if (userdata) {
        const otp = await generateMail(email);
        userdata.otp = otp;
        console.log("otp:", otp);
        userdata.otp_update_time = new Date();
        await userdata.save();
        res
          .status(HttpStatusCodes.OK)
          .json({ message: "Email verification done" });
      } else {
        res
          .status(HttpStatusCodes.NOT_FOUND)
          .json({ message: "Invalid Email" });
      }
    }
  } catch (error) {
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

const updatePassword = async (req, res) => {
  try {
    //validation of input
    const requiredFields = ["email", "password"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    } else {
      const { email, password } = req.body;
      const hashed_password = await hashedPass(password);
      const userdata = await usercollection.findOneAndUpdate(
        { email: email },
        {
          $set: {
            password: hashed_password,
          },
        }
      );
      res.status(HttpStatusCodes.OK).json({ message: "Password Updated" });
    }
  } catch (error) {
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

const getuserDetails = async (req, res, next) => {
  try {
    console.log("getuserDetails backend");
    const data = req.query;
    // console.log(data.userId);
    const userdata = await usercollection.findById(data.userId);
    // console.log("userdata:", userdata);
    res.status(HttpStatusCodes.OK).json(userdata);
  } catch (error) {
    // console.log(error.error);
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

const editUserProfile = async (req, res, next) => {
  try {
    console.log("editUserProfile backend");
    const { _id, firstName, lastName, email } = req.body;
    const userdata = await usercollection.findByIdAndUpdate(_id, {
      $set: { firstName: firstName, lastName: lastName, email: email },
    });
    console.log("userdata:", userdata);
    res.status(HttpStatusCodes.OK).json(userdata);
  } catch (error) {
    console.log(error.error);
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

const getSpecialization = async (req, res, next) => {
  try {
    console.log("getSpecialization backend");
    const spec = await specCollection.find();
    res.status(HttpStatusCodes.OK).json(spec);
  } catch (error) {
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

const getDocotrs = async (req, res, next) => {
  try {
    console.log("getDocotrs backend");
    const doctor = await doctorCollection.find({
      kyc_verification: "true",
      blocked: "false",
      otp_verification: true,
    });
    res.status(HttpStatusCodes.OK).json(doctor);
  } catch (error) {
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

const getDoctorDetails = async (req, res, next) => {
  try {
    console.log("getDocotrs backend");
    const data = req.query;
    // console.log('req userId:',req.userId)
    const doctor = await doctorCollection.findById(data._id);
    // console.log("doctor:", doctor);
    res.status(HttpStatusCodes.OK).json(doctor);
  } catch (error) {
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

const getSlots = async (req, res, next) => {
  try {
    console.log("getSlots backend");
    const data = req.query;
    const now = new Date().toISOString(); // Get the current date and time in ISO format
    const slot = await slotCollection
      .find({
        docId: data._id,
        booked: false,
        time: { $gte: now }, // Filter slots from the current time onward
      })
      .sort({ time: 1 });
    // const slot = await slotCollection
    //   .find({ docId: data._id, booked: false })
    //   .sort({ time: 1 });
    console.log('slot:',slot);
    res.status(HttpStatusCodes.OK).json(slot);
  } catch (error) {
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

const addSlots = async (req, res, next) => {
  try {
    console.log("addSlots backend");
    const data = req.body;
    console.log(data);
    const slot = await slotCollection.findByIdAndUpdate(
      data._id,
      { $set: { bookedUserId: data.userId, docId: data.docId, booked: true } },
      { new: true }
    );
    console.log("slots after booking:", slot);
    res.status(HttpStatusCodes.CREATED).json({ message: "slot updated" });
  } catch (error) {
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

const getSlot = async (req, res, next) => {
  try {
    console.log("getSlot backend");
    const data = req.query;
    console.log(data);
    const slot = await slotCollection.findById(data.slotId).populate("docId");
    console.log("slot:", slot);
    res.status(HttpStatusCodes.OK).json(slot);
  } catch (error) {
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

const check_if_the_slot_available = async (req, res, next) => {
  try {
    console.log("check_if_the_slot_available backend");
    if (!req.query.slotId) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: "slot Id is missing" });
    }
    const { slotId } = req.query;
    console.log("slotId:", slotId, req.query);
    const slot = await bookedSlotCollection.findOne({ slotId: slotId });
    console.log("slot:", slot);
    if (slot && slot.consultation_status === "pending") {
      res
        .status(HttpStatusCodes.UNAUTHORIZED)
        .json({ message: "Slot already booked! Try another slot" });
    } else {
      res.status(HttpStatusCodes.OK).json({ message: "Select payment method" });
    }
  } catch (error) {
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

const razorpay = require("razorpay");
const razorID_Key = process.env.razorpay_key_id;
const razorSEC_Key = process.env.rasorpay_secret_id;

const razorpayInstance = new razorpay({
  key_id: razorID_Key,
  key_secret: razorSEC_Key,
});

const booking_payment = async (req, res, next) => {
  try {
    console.log("booking_payment backend");
    const { consultation_fee } = req.body;
    const options = {
      amount: consultation_fee * 100,
      currency: "INR",
      receipt: "razorUser@gmail.com",
    };

    razorpayInstance.orders.create(options, (err, order) => {
      console.log("razorpay instance creation", order);
      if (!err) {
        res.status(HttpStatusCodes.OK).json({
          success: true,
          fee: order.amount,
          key_id: razorID_Key,
          order_id: order.id,
        });
      } else {
        //check is this the razor pay faiure case by changung the status...
        console.log("razorpay failure case", err);
        res
          .status(HttpStatusCodes.BAD_REQUEST)
          .json({ success: false, message: err });
      }
    });
  } catch (error) {
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

const appointmnet_booking = async (req, res) => {
  try {
    console.log("appointmnet_booking backend");
    const patient_details = req.body;
    console.log(patient_details);
    //slot updated as booked
    const slot = await slotCollection.findById(patient_details.slotId);
    if (slot.booked === true) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({
        message:
          "This slot is already booked,try again from selecting the slot",
      });
    }
    // if(patient_details.payment_status===true){
    const slots = await slotCollection.findByIdAndUpdate(
      patient_details.slotId,
      { $set: { booked: true } }
    );
    // }
    //booked slots creation
    const bookedSlot = await bookedSlotCollection.create(patient_details);
    res
      .status(HttpStatusCodes.CREATED)
      .json({ message: "Slot booking completed" });
  } catch (error) {
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

const userDetails = async (req, res) => {
  try {
    console.log("userDetails backend");
    const data = req.query;
    console.log(data.userId);
    const user = await usercollection.findById(data.userId);
    if (!user) {
      return res
        .status(HttpStatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }
    res.status(HttpStatusCodes.OK).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

const get_booking_details = async (req, res) => {
  try {
    console.log("get get_booking_details serverside");
    const data = req.query;
    console.log(data, data.userId);
    const bookedSlots = await bookedSlotCollection
      .find({ userId: data.userId })
      .populate({
        path: "slotId",
        populate: {
          path: "docId",
        },
      })
      .populate("userId");
    // console.log("bookedSlots:", bookedSlots, bookedSlots.length);
    res.status(HttpStatusCodes.OK).json(bookedSlots);
  } catch (error) {
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

const cancelSlot = async (req, res) => {
  try {
    console.log("get get_booking_details serverside");
    const data = req.query;
    console.log(data, data.slotId);
    const slot = await slotCollection.findByIdAndUpdate(data.slotId, {
      $set: { cancelled: true },
    });
    const bookedSlot = await bookedSlotCollection.findOneAndUpdate(
      { slotId: data.slotId },
      { $set: { consultation_status: "cancelled" } }
    );
    console.log(bookedSlot);
    const user = await usercollection.findById(bookedSlot.userId);
    await usercollection.findByIdAndUpdate(bookedSlot.userId, {
      $set: { wallet: user.wallet + slot.bookingAmount },
    });
    res.status(HttpStatusCodes.OK).json({ message: "slot cancelled" });
  } catch (error) {
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

const upcoming_appointment = async (req, res) => {
  try {
    console.log("get upcoming_appointment serverside");
    const data = req.query;
    console.log("data:", data);
    
    // Get the current time
    const now = new Date();
    
    // Define the time margin (e.g., 15 minutes)
    const margin = 15 * 60 * 1000; // 15 minutes in milliseconds
    
    // Fetch all booked slots for the specified doctor
    const bookedSlots = await bookedSlotCollection
      .find({ userId: data._id, consultation_status: "pending" })
      .populate("slotId")
      .populate("userId")
      .populate("doctorId");
    
    console.log("bookedSlots:", bookedSlots);
    
    // Filter slots that are after the current time or within the margin
    const upcomingAppointments = bookedSlots.filter((slot) => {
      const slotTime = new Date(slot.slotId.time);
      // Check if the slot is after the current time or within the margin past the current time
      return slotTime > now - margin;
    });
    
    // Sort by time to get the earliest upcoming appointment
    upcomingAppointments.sort((a, b) => new Date(a.slotId.time) - new Date(b.slotId.time));
    
    const nextUpcomingAppointment = upcomingAppointments[0];
    
    if (nextUpcomingAppointment) {
      console.log("Next appointment:", nextUpcomingAppointment);
      res.status(HttpStatusCodes.OK).json(nextUpcomingAppointment);
    } else {
      console.log("No upcoming appointments found.");
      res.status(HttpStatusCodes.OK).json({});
    }
    // const bookedSlots = await bookedSlotCollection
    //   .find({ userId: data._id })
    //   .populate("slotId")
    //   .populate("userId")
    //   .populate("doctorId");

    // const currentTime = Date.now();

    // // Define the time window for considering an appointment as "upcoming" (30 minutes in milliseconds)
    // const upcomingWindow = 30 * 60 * 1000;

    // const upcomingAppointments = bookedSlots
    //   .filter((slot) => {
    //     const appointmentTime = new Date(slot.slotId.time).getTime();
    //     return appointmentTime + upcomingWindow > currentTime;
    //   })
    //   .sort((a, b) => new Date(a.slotId.time) - new Date(b.slotId.time));

    // const nextAppointment =
    //   upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;

    // if (nextAppointment) {
    //   console.log("Next appointment:", nextAppointment);
    //   res.status(HttpStatusCodes.OK).json(nextAppointment);
    // } else {
    //   console.log("No upcoming appointments found.");
    //   res.status(HttpStatusCodes.OK).json({});
    // }
  } catch (error) {
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

const getUpcomingSlot = async (req, res) => {
  try {
    console.log(req.query);
    const { appointmentId, roomId } = req.query;
    const data = await bookedSlotCollection.findById({ _id: appointmentId });
    console.log("data:", data);
    res.status(HttpStatusCodes.OK).json(data);
  } catch (error) {
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

// const add_prescription = async (req, res) => {
//   try {
//     console.log(req.query);
//     const { userId } = req.query;
//     const data = await prescriptionCollection.find({}).populate("bookedSlot");
//     const userPrescription = data.filter((prescription) => {
//       return prescription.bookedSlot.userId.toString() === userId;
//     });
//     console.log("data:", userPrescription);
//     res.status(HttpStatusCodes.CREATED).json(userPrescription);
//   } catch (error) {
//     res
//       .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ message: "Internal Server Error" });
//   }
// };

const get_prescription_details= async (req, res) => {
  try {
    console.log('get_prescription_details:',req.query);
    if(!req.query_id){
      res.status(HttpStatusCodes.BAD_REQUEST).json({message:"missing required data"})
    }else{
      const { _id } = req.query;
      const data = await prescriptionCollection.findById(_id)
      console.log('prescription details:',data);
      res.status(HttpStatusCodes.CREATED).json(data);
    }
  } catch (error) {
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

const editUserProfile_name = async (req, res) => {
  try {
    const { userId, firstName, lastName } = req.body;
    await usercollection.findByIdAndUpdate(userId, {
      $set: { firstName: firstName, lastName: lastName },
    });
    res
      .status(HttpStatusCodes.OK)
      .json({ message: "Profile updated successfully" });
  } catch (error) {
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

const opt_for_new_email = async (req, res) => {
  try {
    const { userId, email } = req.body;
    const user = await usercollection.findById(userId);
    if (user.email === email) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: "Existing email. Try another" });
    } else {
      const otp = await generateMail(email);
      await usercollection.findByIdAndUpdate(userId, {
        $set: { otp: otp, otp_update_time: new Date() },
      });
      res
        .status(HttpStatusCodes.OK)
        .json({ message: "Otp send to your email" });
    }
  } catch (error) {
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

const edit_user_profile_picture = async (req, res) => {
  try {
    const { userId, image_url } = req.body;
    if (!userId && !image_url) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: "missing required fields" });
    } else {
      await usercollection.findByIdAndUpdate(userId, {
        $set: { profile_picture: image_url },
      });
      res
        .status(HttpStatusCodes.OK)
        .json({ message: "Profile picture updated Successfully" });
    }
  } catch (error) {
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

module.exports = {
  registerUser,
  resendOtp,
  verifyOtp,
  userLogin,
  verifyEmail,
  updatePassword,
  getuserDetails,
  editUserProfile,
  getSpecialization,
  getDocotrs,
  getDoctorDetails,
  getSlots,
  addSlots,
  getSlot,
  check_if_the_slot_available,
  booking_payment,
  appointmnet_booking,
  userDetails,
  get_booking_details,
  cancelSlot,
  upcoming_appointment,
  getUpcomingSlot,
  // add_prescription,
  get_prescription_details,
  editUserProfile_name,
  opt_for_new_email,
  edit_user_profile_picture,
};

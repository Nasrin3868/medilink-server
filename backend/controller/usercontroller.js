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
      console.log('user is null or not:',user)
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
    console.log('user login controller');
    
    const requiredFields = ["email", "password"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    } else {
      const { email, password } = req.body;
      const userdata = await usercollection.findOne({ email: email });
      console.log('userdata:',userdata);
      
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
            console.log('logs data:',data);
            
            const accessToken = jwt.sign(data, process.env.JWT_ACCESS_TOKEN);
            // const accessToken = jwt.sign(data, process.env.JWT_ACCESS_TOKEN,{ expiresIn: '1m' });
            // console.log('accessToken:',accessToken);
            // console.log('just before creating refresh token');
            // console.log('JWT_REFRESH_TOKEN:', process.env.JWT_REFRESH_TOKEN);
            //  const refreshToken = jwt.sign(data, process.env.JWT_REFRESH_TOKEN, { expiresIn: '7d' });
            //  console.log('error in refreshToken');
             
            //  console.log('access,refresh token:',accessToken,refreshToken);
             
            // userdata.refreshToken=refreshToken
            // // await userdata.save()
            // console.log('refreshToken:',refreshToken,userdata._id);
            
            // await usercollection.updateOne({ _id: userdata._id }, { $set: { refreshToken } });
            const accessedUser = {
              _id: userdata._id,
              firstName: userdata.firstName,
              lastName: userdata.lastName,
              email: userdata.email,
              role: userdata.role,
            };
            res
            // .cookie('refreshToken', refreshToken, {
            //   httpOnly: true,
            //   secure: true, // only for https
            //   sameSite: 'Strict',
            //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            // })
            .status(HttpStatusCodes.OK).json({
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


const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  console.log('refresh token controller:',token);
  if (!token) return res.status(401).json({ message: 'No refresh token found' });
  
  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_TOKEN);
    console.log('payload:',payload);
    const user = await usercollection.findById(payload.userId);
    console.log('user:',user);
    
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = jwt.sign({ userId: user._id }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '15m' });
    console.log('nreAccessToken:',newAccessToken);
    
    res.status(200).json({ accessToken: newAccessToken });

  } catch (error) {
    res.status(403).json({ message: 'Refresh token expired or invalid' });
  }
};

const logOut=async(req,res)=>{
  res.clearCookie('refreshToken');
  res.status(200).json({ message: "Logged out successfully" });
}

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
    console.log("userdata:", userdata);
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

const checkIfTheSlotAvailable = async (req, res, next) => {
  try {
    console.log("checkIfTheSlotAvailable backend");
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

const bookingPayment = async (req, res, next) => {
  try {
    console.log("bookingPayment backend");
    const { consultation_fee } = req.body;
    const options = {
      amount: consultation_fee * 100,
      currency: "INR",
      receipt: "razorUser@gmail.com",
    };
    console.log("Razorpay Key ID:", razorID_Key);
    console.log('keys are same:',razorID_Key===razorpayInstance.key_id);
    
    console.log("Razorpay Secret Key:", razorSEC_Key);

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
    }else{
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
    }
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

const getBookingDetails = async (req, res) => {
  try {
    console.log("get getBookingDetails serverside");
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
    console.log("get canceled slot serverside");
    const data = req.query;
    console.log(data, data.slotId);
    const slot = await slotCollection.findByIdAndUpdate(data.slotId, {
      $set: { cancelled: true,booked:false },
    });
    if (!slot) {
        return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Slot not found." });
    }
    console.log('cancelled slot:',slot);

    const slotTime = new Date(slot.time).getTime();
    const now = Date.now();
    const CANCEL_WINDOW_MINUTES = 10; // Define your "no refund" window
    console.log('now,noRefundTime:',now,slotTime);

    // Time window for refund logic
    const noCancellationTime = slotTime; // Cannot cancel at or after the start time
    const noRefundTime = slotTime - (CANCEL_WINDOW_MINUTES * 60 * 1000); // e.g., 10 minutes before slot time
    console.log('now,noRefundTime:',now,noCancellationTime,noRefundTime);

    // --- 2. Check for the "No Cancellation" window ---
    if (now >= noCancellationTime) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ 
            message: "Cancellation not allowed after the appointment start time." 
        });
    }

    // --- 3. Determine Refund Eligibility ---
    let refundAmount = slot.bookingAmount || 0;
    let refundMessage = "Slot successfully cancelled.";
    let shouldRefund = true
    console.log('now,noRefundTime:',now,noRefundTime);
    
    if (now >= noRefundTime) {
        // Cancellation is within 10 minutes of the slot time (or your defined window)
        refundAmount = 0; // Set refund amount to zero
        shouldRefund = false;
        refundMessage = `Slot cancelled, but no refund is provided for cancellations made within ${CANCEL_WINDOW_MINUTES} minutes of the appointment.`;
    }
    // --- 4. Update the main slot document ---
        const updatedSlot = await slotCollection.findByIdAndUpdate(
            data.slotId,
            { $set: { cancelled: true, booked: false } },
            { new: true }
        );

        // --- 5. Update the booked slot document ---
        const bookedSlot = await bookedSlotCollection.findOneAndUpdate(
            { slotId: data.slotId },
            { $set: { consultation_status: "cancelled" } }
        );

        if (!bookedSlot) {
            // Should not happen if originalSlot was found, but a safety check is good
            return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Booked slot entry not found." });
        }
        
        // --- 6. Handle Refund (if applicable) ---
        if (shouldRefund && refundAmount > 0) {
            const user = await usercollection.findByIdAndUpdate(
                bookedSlot.userId,
                { $inc: { wallet: refundAmount } },
                { new: true }
            );
            if (!user) {
                // Log or handle the case where the user wasn't found for the refund
                console.error("User not found for refund:", bookedSlot.userId);
            }
        }

        res.status(HttpStatusCodes.OK).json({ message: refundMessage });

  //   const bookedSlot = await bookedSlotCollection.findOneAndUpdate(
  //     { slotId: data.slotId },
  //     { $set: { consultation_status: "cancelled" } }
  //   );
  //   if (!bookedSlot) {
  //       return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Booked slot entry not found." });
  //   }
  //   console.log(bookedSlot);
  //   const user = await usercollection.findById(bookedSlot.userId);
  //   await usercollection.findByIdAndUpdate(bookedSlot.userId, {
  //     $set: { wallet: user.wallet + slot.bookingAmount },
  //   });
  //   res.status(HttpStatusCodes.OK).json({ message: "slot cancelled" });
  } catch (error) {
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

const upcomingAppointment = async (req, res) => {
  try {
    console.log("get upcomingAppointment serverside");
    const data = req.query;
    console.log("data:", data);
    const now = new Date();
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

// const addPrescription = async (req, res) => {
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

const getPrescriptionDetails= async (req, res) => {
  try {
    console.log('getPrescriptionDetails:',req.query);
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

const editUserProfileName = async (req, res) => {
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

const optForNewEmail = async (req, res) => {
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

const editUserProfilePicture = async (req, res) => {
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

const prescriptionDetails=async(req,res)=>{
  try{
    console.log("getPrescriptionDetails serverside");
    const slotId = req.query.slotId;
    console.log('slotId:',slotId);
    if (!slotId) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "slotId is not passed" });
    } else {
      const prescription=await prescriptionCollection.findOne({bookedSlot:slotId})
      console.log('prescription',prescription);
      res.status(HttpStatusCodes.OK).json(prescription);
    }
  }catch(error){
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
}

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
  checkIfTheSlotAvailable,
  bookingPayment,
  appointmnet_booking,
  userDetails,
  getBookingDetails,
  cancelSlot,
  upcomingAppointment,
  getUpcomingSlot,
  // addPrescription,
  getPrescriptionDetails,
  editUserProfileName,
  optForNewEmail,
  editUserProfilePicture,
  prescriptionDetails,
  refreshToken,
  logOut
};

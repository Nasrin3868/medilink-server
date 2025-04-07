const doctorcollection = require("../model/doctormodel");
const slotCollection = require("../model/slotModel");
const adminCollection = require("../model/adminmodel");
const userCollection = require("../model/usermodel");
const specializationCollection = require("../model/specializationModel");
const { hashedPass, comparePass } = require("../helper/hashPassword");
const {
  generateMail,
  generateMailForRoomId,
} = require("../helper/generateOtp");
const jwt = require("jsonwebtoken");
const doctorKycCollection = require("../model/docKyc");
const bookedSlotCollection = require("../model/bookedSlotModel");
const prescriptionCollection = require("../model/prescriptionModel");
const {HttpStatusCodes}=require("../helper/enum")

const { check_the_file_is_in_pdf,check_the_file_is_an_image } = require("../helper/isPDF");

const doctorRegistration = async (req, res) => {
  try {
    console.log("doctor registration backend");
    //validation of input
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "contactno",
      "specialization",
      "current_working_hospital_address",
      "experience",
      "consultation_fee",
      "identity_proof_type",
      "password",
      "identity_proof",
      "doctors_liscence",
      "qualification_certificate",
      "experience_certificate",
      'profile_picture'
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({
          error: `Missing required fields: ${
            (missingFields.join(", "), missingFieldOfCertificates.join(", "))
          }`,
        });
    } else {
      const {
        firstName,
        lastName,
        email,
        contactno,
        specialization,
        current_working_hospital_address,
        experience,
        consultation_fee,
        identity_proof_type,
        password,
        identity_proof,
        qualification_certificate,
        experience_certificate,
        doctors_liscence,
        profile_picture
      } = req.body;
      const doctor = await doctorcollection.findOne({ email });
      if (doctor != null) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "Email already exists" });
      } else {
        const hashed_password = await hashedPass(password);
        console.log("hased password:", hashed_password);
        const otp = await generateMail(email);
        const doctordata = await doctorcollection.create({
          firstName: firstName,
          lastName: lastName,
          email: email,
          contactno: contactno,
          profile_picture:profile_picture,
          current_working_hospital_address: current_working_hospital_address,
          specialization: specialization,
          experience: experience,
          consultation_fee: consultation_fee,
          identity_proof_type: identity_proof_type,
          identity_proof: identity_proof,
          doctors_liscence: doctors_liscence,
          qualification_certificate:qualification_certificate,
          experience_certificate:experience_certificate,
          otp: otp,
          otp_update_time: new Date(),
          password: hashed_password,
        });
        console.log("doctordata befor updating mongodb:", doctordata);
        await doctordata.save();
        const data = await doctorcollection.findOne({ email: email });
        console.log("data:", data);
        const kyc = await doctorKycCollection.create({
          docId: data._id,
        });
        console.log("kyc:", kyc);
        console.log("updated mongodb");
        res.status(HttpStatusCodes.CREATED).json({ message: "Doctor Registration successfull" });
      }
    }
  } catch (error) {
    console.log("error due to doctor registration");
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

// const doctorRegistration = async (req, res) => {
//   try {
//     console.log("doctor registration backend");
//     //validation of input
//     const requiredFields = [
//       "firstName",
//       "lastName",
//       "email",
//       "contactno",
//       "specialization",
//       "current_working_hospital_address",
//       "experience",
//       "consultation_fee",
//       "identity_proof_type",
//       "password",

//     ];
//     const missingFields = requiredFields.filter((field) => !req.body[field]);

//     // Validation of PDF files
//     const identity_proof = check_the_file_is_in_pdf(
//       req.files["identity_proof"][0]
//     );
//     const doctors_liscence = check_the_file_is_in_pdf(
//       req.files["doctors_liscence"][0]
//     );
//     const qualification_certificate = req.files[
//       "qualification_certificate"
//     ].map((file) => check_the_file_is_in_pdf(file));
//     const experience_certificate = req.files["experience_certificate"].map(
//       (file) => check_the_file_is_in_pdf(file)
//     );
//     const profile_picture=check_the_file_is_an_image(
//       req.files['profile_picture'][0]
//     )

//     const allFileChecks = [
//       identity_proof,
//       doctors_liscence,
//       ...qualification_certificate,
//       ...experience_certificate,
//       profile_picture
//     ];

//     try {
//       await Promise.all(allFileChecks);
//       console.log("All files are valid PDFs");
//     } catch (error) {
//       console.log("One or more files are not PDFs");
//       return res
//         .status(HttpStatusCodes.BAD_REQUEST)
//         .json({ message: "One or more files are not in PDF format" });
//     }

//     //validation of missing fields
//     const requiredFieldOfCertificates = [
//       "identity_proof",
//       "doctors_liscence",
//       "qualification_certificate",
//       "experience_certificate",
//       'profile_picture'
//     ];
//     const missingFieldOfCertificates = requiredFieldOfCertificates.filter(
//       (field) => !req.files[field]
//     );
//     if (missingFields.length > 0 || missingFieldOfCertificates.length > 0) {
//       return res
//         .status(HttpStatusCodes.BAD_REQUEST)
//         .json({
//           error: `Missing required fields: ${
//             (missingFields.join(", "), missingFieldOfCertificates.join(", "))
//           }`,
//         });
//     } else {
//       const {
//         firstName,
//         lastName,
//         email,
//         contactno,
//         specialization,
//         current_working_hospital_address,
//         experience,
//         consultation_fee,
//         identity_proof_type,
//         password,
//       } = req.body;
//       const doctor = await doctorcollection.findOne({ email });
//       if (doctor != null) {
//         res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "Email already exists" });
//       } else {
//         const hashed_password = await hashedPass(password);
//         console.log("hased password:", hashed_password);
//         const otp = await generateMail(email);
//         const doctordata = await doctorcollection.create({
//           firstName: firstName,
//           lastName: lastName,
//           email: email,
//           contactno: contactno,
//           profile_picture:req.files['profile_picture'][0].path,
//           current_working_hospital_address: current_working_hospital_address,
//           specialization: specialization,
//           experience: experience,
//           consultation_fee: consultation_fee,
//           identity_proof_type: identity_proof_type,
//           identity_proof: req.files["identity_proof"][0].path,
//           doctors_liscence: req.files["doctors_liscence"][0].path,
//           qualification_certificate: req.files["qualification_certificate"].map(
//             (file) => file.path
//           ),
//           experience_certificate: req.files["experience_certificate"].map(
//             (file) => file.path
//           ),
//           otp: otp,
//           password: hashed_password,
//         });
//         console.log("doctordata befor updating mongodb:", doctordata);
//         await doctordata.save();
//         const data = await doctorcollection.findOne({ email: email });
//         console.log("data:", data);
//         const kyc = await doctorKycCollection.create({
//           docId: data._id,
//         });
//         console.log("kyc:", kyc);
//         console.log("updated mongodb");
//         res.status(HttpStatusCodes.CREATED).json({ message: "Doctor Registration successfull" });
//       }
//     }
//   } catch (error) {
//     console.log("error due to doctor registration");
//     res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
//   }
// };

const getSpecialization = async (req, res) => {
  try {
    console.log("get specialization serverside");
    const specialization = await specializationCollection.find();
    res.status(HttpStatusCodes.OK).json({ specialization: specialization });
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

const resendOtp = async (req, res) => {
  try {
    console.log('resend otp req.body:',req.body)
    //validation of input
    const requiredFields = ["email"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({
          error: `Missing required fields: ${missingFields.join(", ")}`,
        });
    } else {
      const { email } = req.body;
      console.log('req.body:',req.body)
      console.log("email:", email);
      const otp = await generateMail(email);
      const doctordata = await doctorcollection.findOneAndUpdate(
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
      if (doctordata) {
        res.status(HttpStatusCodes.OK).json({ message: "Successfully send a new OTP" });
      } else {
        res.status(HttpStatusCodes.NOT_FOUND).json({ message: "User not found" });
      }
    }
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    //validation of input
    const requiredFields = ["email", "otp"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({
          error: `Missing required fields: ${missingFields.join(", ")}`,
        });
    } else {
      console.log(req.body.email, req.body.otp);
      const { email, otp } = req.body;
      const doctordata = await doctorcollection.findOne({ email: email });
      console.log(doctordata);
      if (doctordata.otp !== Number(otp)) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: "Incorrect OTP" });
      } else {
        const otpExpiryMinute = 59;
        otpExpirySecond = otpExpiryMinute * 60;
        // checking the timer
        const timeDifference = Math.floor(
          (new Date() - doctordata.otp_update_time) / 1000
        );
        console.log("new date() in otp:", new Date());
        console.log(
          "userdata.otp_update_time in otp:",
          doctordata.otp_update_time
        );
        console.log("timeDifference in otp:", timeDifference);
        if (timeDifference > otpExpirySecond) {
          console.log("otp expired");
          res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: "Otp Expired" });
        } else {
          doctordata.otp_verification = true;
          if(req.body.role){
            console.log('role:',req.body.role)
            doctordata.email=req.body.new_email
          }
          await doctordata.save();
          res.status(HttpStatusCodes.OK).json({ message: "Account verified successfully." });
        }
      }
    }
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const doctorLogin = async (req, res) => {
  try {
    //validation of input
    const requiredFields = ["email", "password"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({
          error: `Missing required fields: ${missingFields.join(", ")}`,
        });
    } else {
      console.log("doctor login backend");
      const { email, password } = req.body;
      console.log("email,password:", email, password);
      const doctordata = await doctorcollection.findOne({ email: email });
      console.log("doctordata:", doctordata);
      if (doctordata) {
        const password_match = await comparePass(password, doctordata.password);
        console.log("password_match:", password_match);
        if (password_match) {
          console.log("doctordata.blocked:", doctordata.blocked);
          if (doctordata.blocked === "true") {
            res
              .status(HttpStatusCodes.FORBIDDEN)
              .json({ message: "Your account is blocked by Admin" });
          } else if (doctordata.otp_verification === false) {
            const otp = await generateMail(doctordata.email);
            doctordata.otp = otp;
            doctordata.otp_update_time = new Date();
            await doctordata.save();
            res
              .status(HttpStatusCodes.OK)
              .json({
                email: email,
                message: "Complete OTP verification for Login",
              });
          } else {
            if (doctordata.kyc_verification === "false") {
              res
                .status(HttpStatusCodes.BAD_REQUEST)
                .json({
                  message: `Account verification is under processing, Wait for Admin's approval`,
                });
            } else {
              console.log("unblocked and verified user");
              const data = {
                doctorId: doctordata._id,
              };
              const accessToken = jwt.sign(data, process.env.JWT_ACCESS_TOKEN);
              const accessedUser = {
                _id: doctordata._id,
                firstName: doctordata.firstName,
                lastName: doctordata.lastName,
                email: doctordata.email,
                role: doctordata.role,
              };
              console.log("accesstoken:", accessToken);
              console.log("accessedUser:", accessedUser);
              res.status(HttpStatusCodes.OK).json({
                accessToken,
                accessedUser,
                message: "Login successfully",
              });
            }
          }
        } else {
          res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Incorrect password" });
        }
      } else {
        res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Invalid username" });
      }
    }
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

//verify email for forget password
const verifyEmail = async (req, res) => {
  try {
    //validation of input
    const requiredFields = ["email"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({
          error: `Missing required fields: ${missingFields.join(", ")}`,
        });
    } else {
      console.log("doctor verify email");
      const { email } = req.body;
      const doctordata = await doctorcollection.findOne({ email: email });

      if (doctordata) {
        const otp = await generateMail(email);
        doctordata.otp = otp;
        doctordata.otp_update_time = new Date();
        await doctordata.save();
        res.status(HttpStatusCodes.OK).json({ message: "Email verification done" });
      } else {
        res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Invalid Email" });
      }
    }
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const updatePassword = async (req, res) => {
  try {
    //validation of input
    const requiredFields = ["email", "password"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({
          error: `Missing required fields: ${missingFields.join(", ")}`,
        });
    } else {
      const { email, password } = req.body;
      const hashed_password = await hashedPass(password);
      const doctordata = await doctorcollection.findOneAndUpdate(
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
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const getDoctorDetails = async (req, res) => {
  try {
    const data = req.query;
    const doc = await doctorcollection.findById(data._id);
    res.status(HttpStatusCodes.OK).json(doc);
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const editDoctorProfile = async (req, res) => {
  try {
    console.log("edit profile of doc serverside");
    const data = req.body;
    console.log(data)
    const doc = await doctorcollection.findOneAndUpdate(
      { _id: data._id },
      {
        $set: {
          firstName: data.firstName,
          lastName: data.lastName,
          contactno: data.contactno,
          experience: data.experience,
          consultation_fee: data.consultation_fee,
          experience: data.experience,
        },
      }
    );
    console.log('doctor details:',doc)
    res.status(HttpStatusCodes.OK).json({ message: "profile updated successfully" });
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const edit_doctor_profile_picture=async(req,res)=>{
  try{
    const {doctorId,image_url}=req.body
    if(!doctorId&&!image_url){
      res.status(HttpStatusCodes.BAD_REQUEST).json({message:"missing required fields"})
    }else{
      await doctorcollection.findByIdAndUpdate(doctorId,{$set:{profile_picture:image_url}})
      res.status(HttpStatusCodes.OK).json({message:"Profile picture updated Successfully"})
    }
  }catch(error){
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({message:"Internal Server Error"})
  }
}

const opt_for_new_email= async (req, res) => {
  try {
    const {doctorId,email}=req.body
    const doctor=await doctorcollection.findById(doctorId)
    console.log(req.body,doctor);
    if(doctor.email===email){
      res.status(HttpStatusCodes.CONFLICT).json({message:'Existing email. Try another'})
    }else{
      const otp = await generateMail(email);
      await doctorcollection.findByIdAndUpdate(doctorId,{$set:{otp:otp,otp_update_time:new Date()}})
      res.status(HttpStatusCodes.OK).json({message:'Otp send to your email'});
    }
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

const slotCreation = async (req, res) => {
  try {
    console.log("add slot serverside");
    const data = req.body;
    console.log("data from adding slot", data);
    if (!data) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "slot adding Failed, no data passed to server side" });
    } else {

      //.................valuate the slot_time and current_time...................

      // Convert to local date format from global date format
      const utcDate1 = new Date(data.time);
      const localDate1 = new Date(
        utcDate1.getTime() - utcDate1.getTimezoneOffset() * 60000
      );
      // Current date in local date format
      const currentUtcDate1 = new Date();
      const currentLocalDate1 = new Date(
        currentUtcDate1.getTime() - currentUtcDate1.getTimezoneOffset() * 60000
      );

      // Check if the slot already exists for the same docId and time
      const existingSlot = await slotCollection.findOne({
        docId: data._id,
        time: data.time,
      });

      if (existingSlot) {
        return res.status(HttpStatusCodes.CONFLICT).json({ message: "Slot already exists" });
      } else if (localDate1 <= currentLocalDate1) {
        console.log(currentLocalDate1, localDate1);
        return res
          .status(HttpStatusCodes.CONFLICT)
          .json({ message: "The selected slot is no longer available" });
        // Please choose a different slot that is after the current time.
      } else {
        const admin = await adminCollection.find({});
        const doctor = await doctorcollection.findById(data._id);
        const slot = await slotCollection.create({
          docId: data._id,
          time: data.time,
          adminPaymentAmount: admin[0].payOut,
          bookingAmount: doctor.consultation_fee,
        });
        await slot.save();
        console.log("slot:", slot);
        res.status(HttpStatusCodes.CREATED).json({ message: "Slot added Successfully" ,slot:slot});
      }
    }
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

const add_all_slots = async (req, res) => {
  try {
    console.log("add_all_slots serverside");

    const { doctorId, slots } = req.body; // Use req.body instead of req.query for POST requests

    // Validate input
    if (!doctorId || !slots || !Array.isArray(slots)) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "Invalid input data" });
    }

    console.log("Slot adds to docId:", doctorId);

    // Fetch admin and doctor details
    const admin = await adminCollection.findOne({});
    const doctor = await doctorcollection.findById(doctorId);

    if (!admin || !doctor) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Admin or Doctor not found" });
    }

    // Prepare slot creation promises
    const slotPromises = slots.map(async (slotTime) => {
      const slot = new slotCollection({
        docId: doctorId,
        time: slotTime,
        adminPaymentAmount: admin.payOut,
        bookingAmount: doctor.consultation_fee,
      });

      // No need to call save() as create() already does this
      return slot.save();
    });

    // Wait for all slots to be created
    const addedSlots = await Promise.all(slotPromises);

    console.log("added_slots:", addedSlots);
    res.status(HttpStatusCodes.CREATED).json(addedSlots);
  } catch (error) {
    console.error("Error adding slots:", error);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

  const doctorSlotDetails = async (req, res) => {
    try {
      console.log("add slot serverside");
      const data = req.query;
      console.log(data);
      if (!data) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "slot adding Failed, Missing fields" });
      } else {
        console.log("slot adds to docId:", data._id);
        const now = new Date().toISOString(); // Get the current date and time in ISO format
        const slots = await slotCollection
          .find({ 
            docId: data._id, 
            // booked: false,
            time: { $gte: now } // Filter slots from the current time onward
          })
          .sort({ time: 1 });
        // const slots = await slotCollection
        //   .find({ docId: data._id })
        //   .sort({ time: 1 });
        console.log("slots to diaplay in slotadding page:", slots.length);
        res.status(HttpStatusCodes.OK).json(slots);
      }
    } catch (error) {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
  };

const RemoveSlot = async (req, res) => {
  try {
    console.log("remove slot serverside");
    const data = req.query;
    console.log(data);
    if (!data) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "slot delete Failed" });
    } else {
      console.log("slot remove from docId:", data._id);
      const slots = await slotCollection.findById(data._id);
      console.log('slots:',slots)
      if(slots.booked==true){
        res.status(HttpStatusCodes.BAD_REQUEST).json({message:"Slot is already booked and cannot be removed."})
      }else{
        const slots = await slotCollection.findByIdAndDelete(data._id);
        res.status(HttpStatusCodes.OK).json({ message: "successfully deleted" });
      }
    }
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

const get_booking_details = async (req, res) => {
  try {
    console.log("get_booking_details serverside");
    const data = req.query;
    console.log(data);
    if (!data) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "get_payment_details Failed" });
    } else {
//       const now = new Date(); // Current time
// let minutes = now.getMinutes();

// // Round up to the next 30-minute mark
// if (minutes > 0 && minutes <= 30) {
//   now.setMinutes(30);
// } else if (minutes > 30) {
//   now.setHours(now.getHours() + 1);
//   now.setMinutes(0);
// } else {
//   now.setMinutes(0);
// }
// now.setSeconds(0);
// now.setMilliseconds(0);

// const nextSlot = now.toISOString(); // Convert to ISO 8601 format
// const bookedSlots = await bookedSlotCollection
//   .find({
//     doctorId: data.doctorId,
//     time: { $gte: nextSlot } // Filter by slots starting from the next available time slot
//   })
//   .populate("slotId")
//   .populate("userId")
//   .populate("doctorId");

// console.log("booked slots:", bookedSlots.length);

      const now = new Date().toISOString(); 
      const bookedSlots = await bookedSlotCollection
        .find({ doctorId: data.doctorId,time: { $gte: now } })
        .populate("slotId")
        .populate("userId")
        .populate("doctorId");
      console.log("booked slots:", bookedSlots);
      res.status(HttpStatusCodes.OK).json(bookedSlots);
    }
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

const get_bookings_of_doctor= async (req, res) => {
  try {
    console.log("get_bookings_of_details serverside");
    const data = req.query;
    console.log(data);
    if (!data) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "get_payment_details Failed" });
    } else {

      const now = new Date().toISOString(); // Get the current date and time in ISO format
      let slots = await slotCollection
        .find({ 
          docId: data.doctorId, 
          booked: true,
          time: { $gte: now } // Filter slots from the current time onward
        })
        .sort({ time: 1 })
      console.log("slots to diaplay in slotadding page:", slots.length);
      
      if (slots.length === 0) {
        return res.status(HttpStatusCodes.OK).json([]); // No slots available
      }else{
        let slotIds = slots.map(slot => slot._id);
        // Step 3: Find booked slots that reference these slot IDs
        let bookedSlots = await bookedSlotCollection
          .find({
            slotId: { $in: slotIds },
            doctorId: data.doctorId,
            consultation_status: 'pending'
          })
          .populate("slotId")
          .populate("userId")
          .populate("doctorId");
    
        console.log("Booked slots:", bookedSlots.length);
        res.status(HttpStatusCodes.OK).json(bookedSlots);
      }
    }
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
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
      .find({ doctorId: data.doctorId, consultation_status: "pending" })
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
    
    const nextUpcomingAppointment = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;;
    
    if (nextUpcomingAppointment) {
      console.log("Next appointment:", nextUpcomingAppointment);
      res.status(HttpStatusCodes.OK).json(nextUpcomingAppointment);
    } else {
      console.log("No upcoming appointments found.");
      res.status(HttpStatusCodes.OK).json({});
    }

    // const bookedSlots = await bookedSlotCollection
    //   .find({ doctorId: data.doctorId })
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
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

const updateUpcomingSlot = async (req, res) => {
  try {
    const { appointmentId, roomId } = req.query;
    const data = await bookedSlotCollection.findByIdAndUpdate(
      { _id: appointmentId },
      { $set: { roomId: roomId } }
    );
    res.status(HttpStatusCodes.OK).json(data);
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

const update_consultationStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.query;
    console.log("queries:", appointmentId, status);
    const data = await bookedSlotCollection.findByIdAndUpdate(
      { _id: appointmentId },
      { $set: { consultation_status: status } }
    );
    console.log("data:", data);
    res.status(HttpStatusCodes.OK).json({ message: "consultation status updated" });
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

const add_prescription = async (req, res) => {
  try {
    const { appointmentId, disease, prescription } = req.query;
    if (!appointmentId || !disease || !prescription) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "Missing required fields" });
    }
    const newPrescription = new prescriptionCollection({
      bookedSlot: appointmentId,
      disease,
      prescription,
    });
    await newPrescription.save();
    console.log('prescription:',newPrescription);
    await bookedSlotCollection.findByIdAndUpdate(appointmentId,{$set:{prescription_id:newPrescription._id}})

    res.status(HttpStatusCodes.CREATED).json({ message: "Prescription added" });
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

const prescriptionDetails=async(req,res)=>{
  try{
    console.log("get_prescription_details serverside");
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

const get_doctor_dashboard_details = async (req, res) => {
  try {
    console.log("get_doctor_dashboard_details server side");
    const { doctorId } = req.query;
    if(!doctorId){
      res.status(HttpStatusCodes.BAD_REQUEST).json({message:"missing required content"})
    }
    const data = await bookedSlotCollection
      .find({ doctorId: doctorId })
      .populate("slotId");
    res.status(HttpStatusCodes.OK).json(data);
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

const share_roomId_through_email = async (req, res) => {
  try {
    console.log("share_roomId_through_email server side");
    const { roomId, slotId } = req.query;
    if(!roomId&&!slotId){
      res.status(HttpStatusCodes.BAD_REQUEST).json({message:"missing required field"})
    }
    console.log(roomId, slotId);
    const data = await bookedSlotCollection.findByIdAndUpdate(slotId,{$set:{roomId:roomId}});
    console.log("slotDetails:", data);
    //get userid from the slot
    const userId = data.userId;
    const userData = await userCollection.findById(userId);
    console.log("userdata:", userData);
    const userEmail = userData.email;
    const emailsend = await generateMailForRoomId(userEmail, roomId);
    data.roomId=roomId
    // await data.save()
    // console.log(data)
    res
      .status(HttpStatusCodes.OK)
      .json({ message: `RoomId is send to user's email account.` });
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  resendOtp,
  verifyOtp,
  doctorLogin,
  verifyEmail,
  updatePassword,
  doctorRegistration,
  getSpecialization,
  getDoctorDetails,
  editDoctorProfile,
  edit_doctor_profile_picture,
  opt_for_new_email,
  slotCreation,
  add_all_slots,
  doctorSlotDetails,
  RemoveSlot,
  get_bookings_of_doctor,
  get_booking_details,
  upcoming_appointment,
  updateUpcomingSlot,
  update_consultationStatus,
  add_prescription,
  get_doctor_dashboard_details,
  share_roomId_through_email,
  prescriptionDetails
  // accessedChats
};

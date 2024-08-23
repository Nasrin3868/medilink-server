const nodemailer = require("nodemailer");

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateMail = async (email) => {
  const otp = generateOtp();
  console.log("otp:", otp);

  let transpoter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.nodemailer_email,
      pass: process.env.nodemailer_password,
    },
  });

  const mailOptions = {
    from: process.env.nodemailer_email,
    to: email,
    subject: "OTP for Verification",
    text: `Your OTP from MediLink application: ${otp}`,
  };

  console.log("mailoptions:", mailOptions);

  return new Promise((resolve, reject) => {
    transpoter.sendMail(mailOptions, (err, info) => {
      console.log("get into return");
      if (err) {
        console.log("error while generating otp");
        reject(err.message);
      } else {
        console.log("generated otp for registration:", otp);
        resolve(otp);
      }
    });
  });
};

const generateMailForRoomId = async (email, roomId) => {
  console.log("generateMailForRoomId function");
  // const roomId = roomId;
  console.log("roomId:", roomId);

  let transpoter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.nodemailer_email,
      pass: process.env.nodemailer_password,
    },
  });

  const mailOptions = {
    from: process.env.nodemailer_email,
    to: email,
    subject: "roomId for the video consultation",
    text: `ROOMID:${roomId}. Your roomId from MediLink application for the doctor consultation through video conference is: ${roomId}.Copy this code and fill the field fo roomId and join.`,
  };

  console.log("mailoptions:", mailOptions);

  return new Promise((resolve, reject) => {
    transpoter.sendMail(mailOptions, (err, info) => {
      console.log("get into return");
      if (err) {
        console.log("error while generating otp");
        reject(err.message);
      } else {
        console.log("generated otp for registration:", otp);
        resolve("otp,resolved email generation for roomId");
      }
    });
  });
};

const update_slot_time_through_email=async (userEmail,doctorEmail) => {
  console.log("generateMailForRoomId function");
  // const roomId = roomId;
  console.log("user email:", userEmail);
  console.log("doctor email:", doctorEmail);

  let transpoter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.nodemailer_email,
      pass: process.env.nodemailer_password,
    },
  });

  const userMailOptions = {
    from: process.env.nodemailer_email,
    to: userEmail,
    subject: "Reminder: Your Medilink Consultation Starts in 10 Minutes",
    text: `Dear ${userEmail},

    This is a quick reminder that your online consultation is set to begin in 10 minutes. Please ensure that you're in a quiet place with a stable internet connection.

    You will be connected with your doctor shortly to discuss your health concerns. Feel free to ask any questions or clarify any doubts during the session.

    We look forward to helping you with your healthcare needs.

    Warm regards,
    The Medilink Team`
  };
  const doctorMailOptions = {
      from: process.env.nodemailer_email,
      to: doctorEmail,
      subject: "Upcoming Consultation Reminder - 10 Minutes Until Your Next Appointment",
      text: `Dear Doctor,

      This is a friendly reminder that your scheduled online consultation will begin in 10 minutes.

      Please ensure you're ready to connect with the patient. If you need any assistance or have any last-minute preparations, feel free to get in touch.

      We wish you a smooth and productive consultation.

      Best regards,
      The Medilink Team`
    };

  console.log("mailoptions:", mailOptions);

  return new Promise((resolve, reject) => {
    transpoter.sendMail(userMailOptions, (err, info) => {
      console.log("get into return");
      if (err) {
        console.log("error while generating email");
        reject(err.message);
      } else {
        console.log("generated email to user's emailId:",userEmail);
        resolve("resolved email generation for consultation updates");
      }
    });
    transpoter.sendMail(doctorMailOptions, (err, info) => {
      console.log("get into return");
      if (err) {
        console.log("error while generating email");
        reject(err.message);
      } else {
        console.log("generated email to doctor's emailId:",doctorEmail);
        resolve("resolved email generation for consultation updates");
      }
    });
  });
};

module.exports = {
  generateMail,
  generateMailForRoomId,
  update_slot_time_through_email,
};

const adminCollection = require("../model/adminmodel");
const userCollection = require("../model/usermodel");
const doctorCollection = require("../model/doctormodel");
const KycCollection = require("../model/docKyc");
const specializationCollection = require("../model/specializationModel");
const bookedSlotCollection = require("../model/bookedSlotModel");
const enum_status = require("../helper/enum");
const { comparePass } = require("../helper/hashPassword");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const {HttpStatusCodes}=require("../helper/enum")

const adminLogin = async (req, res) => {
  try {
    //validation of input
    const requiredFields = ["email", "password"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    } else {
      console.log("admin login backend");
      const { email, password } = req.body;
      console.log("email,password:", email, password);
      const admindata = await adminCollection.findOne({ email: email });
      console.log("admindata:", admindata);
      if (admindata) {
        const password_match = await comparePass(password, admindata.password);
        console.log("password_match:", password_match);
        if (password_match) {
          const data = {
            adminId: admindata._id,
          };
          const accessToken = jwt.sign(data, process.env.JWT_ACCESS_TOKEN);
          const accessedUser = {
            email: admindata.email,
            role: admindata.role,
            payOut: admindata.payOut,
          };
          console.log("accesstoken:", accessToken);
          console.log("accessedUser:", accessedUser);
          res.status(HttpStatusCodes.OK).json({
            accessToken,
            accessedUser,
            message: "Login successfully",
          });
        } else {
          res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Incorrect Password" });
        }
      } else {
        res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Invalid username" });
      }
    }
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

const doctorStatusChange = async (req, res) => {
  try {
    //validation of input
    const requiredFields = ["_id"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    } else {
      const { _id } = req.body;
      const doctordata = await doctorCollection.findById(_id);
      const status = doctordata.blocked;
      if (status === enum_status[0]) {
        doctordata.blocked = enum_status[1];
      } else {
        doctordata.blocked = enum_status[0];
      }
      await doctordata.save();
      res.status(HttpStatusCodes.OK).json({ message: "Doctor status of block changed" });
    }
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

const doctordata = async (req, res) => {
  try {
    const data = req.query;
    console.log("data:", data);
    if (data.doctor === "all") {
      const doctor_data = await doctorCollection.find();
      console.log("doctorData", doctor_data);
      res.status(HttpStatusCodes.OK).json(doctor_data);
    }
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

const doctorBlock = async (req, res) => {
  try {
    const data = req.body;
    if(!data._id){
      res.status(HttpStatusCodes.BAD_REQUEST).json({message:"missing required data"})
    }
    console.log("id of doctor to block:", data);
    const doctor = await doctorCollection.findOne({ _id: data._id });
    doctor.blocked === "true"
      ? (doctor.blocked = "false")
      : (doctor.blocked = "true");
    await doctor.save();
    res.status(HttpStatusCodes.OK).json({ message: "status changed" });
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

const userdata = async (req, res) => {
  try {
    let user_data = await userCollection.find();
    res.status(HttpStatusCodes.OK).json(user_data);
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

const userBlock = async (req, res) => {
  try {
    const data = req.body;
    if(!data._id){
      res.status(HttpStatusCodes.BAD_REQUEST).json({message:"missing required data"})
    }
    const user = await userCollection.findOne({ _id: data._id });
    user.blocked === "true" ? (user.blocked = "false") : (user.blocked = "true");
    await user.save();
    res.status(HttpStatusCodes.OK).json({ message: "status changed" });
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

const userDetails = async (req, res) => {
  try {
    const data = req.body;
    if(!data._id){
      res.status(HttpStatusCodes.BAD_REQUEST).json({message:"missing required data"})
    }
    // console.log('req.query:',req.body);
    const user = await userCollection.findOne({ _id: data._id });
    res.status(HttpStatusCodes.OK).json(user);
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

const kycDataCollection = async (req, res) => {
  try {
    console.log("kyc data collection serverside");
    const data = await KycCollection.find()
      .populate({
        path: "docId",
        match: { kyc_verification: "false" }, // Filter doctors with kyc_verification = false
        select: "-password -created_time -otp -otp_update_time -__v",
      })
      .exec();
    const kycdata = data.filter((item) => item.docId !== null);
    console.log(kycdata);
    res.status(HttpStatusCodes.OK).json(kycdata);
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

const searchUser = async (req, res) => {
  try {
    console.log("searchUser serverside");
    const data = req.body;
    if (!data.data) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "No data to search" });
    } else {
      let searchData = data.data;
      console.log(searchData);
      // Define the regex pattern
      const regex = new RegExp("^" + searchData.toLowerCase(), "i");
      console.log(regex);
      const user_data = await userCollection.find();
      const results = user_data.filter(
        (item) =>
          regex.test(item.firstName) ||
          regex.test(item.lastName) ||
          regex.test(item.email)
      );
      res.status(HttpStatusCodes.OK).json(results);
    }
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

const getSpecialization = async (req, res) => {
  try {
    console.log("getSpecialization serverside");
    const specialization_data = await specializationCollection.find();
    console.log(specialization_data);
    res.status(HttpStatusCodes.OK).json(specialization_data);
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

const addSpecialization = async (req, res) => {
  try {
    const data = req.body;
    console.log("addSpecialization serverside", data);
    if (!data) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "Submission Failed" });
    } else {
      console.log("specialization to add:", data);
      const spec = await specializationCollection.create({
        specialization: data.specialization,
      });
      await spec.save();
      res.status(HttpStatusCodes.CREATED).json({ message: "specialization added Successfully" });
    }
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

const editSpecialization = async (req, res) => {
  try {
    console.log("editSpecialization serverside");
    const data = req.body;
    if (!data) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "Edit Failed" });
    } else {
      console.log("specialization id to edit:", data._id);
      const spec = await specializationCollection.updateOne(
        { _id: data._id },
        { specialization: data.specialization }
      );
      res.status(HttpStatusCodes.OK).json({ message: "Edit Successfully" });
    }
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

const deleteSpecialization = async (req, res) => {
  try {
    console.log("deleteSpecialization serverside");
    const data = req.query;
    if (!data) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "delete Failed" });
    } else {
      console.log("specialization id to delete:", data._id);
      const spec = await specializationCollection.deleteOne({ _id: data._id });
      res.status(HttpStatusCodes.OK).json({ message: "delete Successfully" });
    }
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

const editpayOut = async (req, res) => {
  try {
    console.log("editpayOut serverside");
    const data = req.body;
    if (!data) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "edit payout Failed" });
    } else {
      console.log("pauOut to edit:", data.payOut);
      const spec = await adminCollection.updateMany(
        {},
        { $set: { payOut: data.payOut } }
      );
      // console.log(await );
      res.status(HttpStatusCodes.OK).json({ message: "edited Successfully" });
    }
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

const getKycDetailsOfDoctor = async (req, res) => {
  try {
    console.log("get get_kyc_details_of_doctor serverside");
    const data = req.query;
    if (!data) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "fetching doctor ID Failed" });
    } else {
      console.log("doc Id:", data.docId);
      const _id = data.docId;
      const kyc_details_with_docID = await KycCollection.findOne({
        docId: _id,
      }).populate("docId");
      console.log("kyc_details_with_docID:", kyc_details_with_docID);
      res.status(HttpStatusCodes.OK).json(kyc_details_with_docID);
    }
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

const submitKycDetails = async (req, res) => {
  try {
    console.log("get submit_kyc_details serverside");
    const data = req.body;
    if (!data) {
      res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "Fetching doctor ID Failed" });
      return;
    }
    const kyc_details = await KycCollection.findByIdAndUpdate(
      data._id,
      {
        $set: {
          exp_certificate: data.exp_certificate,
          qualification_certificate: data.qualification_certificate,
          doc_liscence: data.doc_liscence,
          id_proof_type: data.id_proof_type,
          id_proof: data.id_proof,
          specialization: data.specialization,
          curr_work_hosp: data.curr_work_hosp,
        },
      },
      { new: true }
    );

    if (!kyc_details) {
      res.status(HttpStatusCodes.NOT_FOUND).json({ message: "KYC details not found" });
      return;
    }

    if (kyc_details.id_proof_type === false) {
      res.status(HttpStatusCodes.OK).json({
        message: "Verify ID proof type selected and submitted are the same",
      });
    } else if (kyc_details.id_proof === false) {
      res.status(HttpStatusCodes.OK).json({ message: "Verify ID proof" });
    } else if (kyc_details.doc_liscence === false) {
      res.status(HttpStatusCodes.OK).json({ message: "Verify doctor's license" });
    } else if (kyc_details.qualification_certificate === false) {
      res.status(HttpStatusCodes.OK).json({ message: "Verify qualification certificates" });
    } else if (kyc_details.exp_certificate === false) {
      res.status(HttpStatusCodes.OK).json({ message: "Verify experience certificate" });
    } else if (kyc_details.specialization === false) {
      res
        .status(HttpStatusCodes.OK)
        .json({ message: "Verify specialization meets qualification" });
    } else if (kyc_details.curr_work_hosp === false) {
      res.status(HttpStatusCodes.OK).json({ message: "Verify currently working hospital" });
    } else {
      await doctorCollection.findByIdAndUpdate(data.doctor_id, {
        $set: { kyc_verification: true },
      });
      res.status(HttpStatusCodes.OK).json({ message: "KYC verification done" });
    }
    console.log(kyc_details);
  } catch (error) {
    console.error("Error updating KYC details:", error);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

const download = require("download");

const downloadKycDocuments = async (req, res) => {
  try {
    console.log("get downloadKycDocuments serverside");
    const data = req.query;
    if (!data) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: "Fetching data to download failed" });
    }

    console.log("name, index:", data.name, data.index);
    const doctor = await doctorCollection.findById(data.docId);
    if (!doctor) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Doctor not found" });
    }

    console.log("doctor:", doctor);
    let filePath;

    switch (data.name) {
      case "identity_proof":
        filePath = doctor.identity_proof;
        break;
      case "doctors_liscence":
        filePath = doctor.doctors_liscence;
        break;
      case "qualification_certificate":
        if (data.index != -1)
          filePath = doctor.qualification_certificate[data.index];
        console.log("nasjn", data.index, filePath);
        break;
      case "experience_certificate":
        if (data.index != -1)
          filePath = doctor.experience_certificate[data.index];
        break;
      default:
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: "Invalid file type" });
    }

    if (!filePath) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "File not found" });
    }

    const fullPath = path.resolve(filePath); // Ensure the path is resolved correctly
    console.log("fullPath:", fullPath);

    const destinationPath = path.join(
      "D:",
      "Nasrin",
      "medilink_files",
      // "Downloads",
      // "cerificate_download",
      `${data.name}` + Date.now() + path.basename(fullPath)
    );
    console.log("destinationPath:", destinationPath);

    fs.copyFile(fullPath, destinationPath, (err) => {
      if (err) {
        console.error("Error copying file:", err);
        if (!res.headersSent) {
          return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error copying file" });
        }
      } else {
        console.log("certificate dowloaded successfully");
        return res.status(HttpStatusCodes.OK).json({ message: "Downloaded Successfully" });
      }
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    if (!res.headersSent) {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
  }
};

const getAppointmentDetails = async (req, res) => {
  try {
    console.log("get getAppointmentDetails serverside");
    const bookedSlots = await bookedSlotCollection
      .find({})
      .populate({
        path: "slotId",
        populate: {
          path: "docId",
        },
      })
      .populate("userId");
    console.log("bookedSlots:", bookedSlots, bookedSlots.length);
    res.status(HttpStatusCodes.OK).json(bookedSlots);
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

const getAdminDashboardDetails = async (req, res) => {
  try {
    console.log("getAdminDashboardDetails serverside");
    const data = await bookedSlotCollection.find({}).populate("slotId");
    const user = await userCollection.find({}).count();
    const doctor = await doctorCollection.find({}).count();
    console.log("userCount,docCount:", user, doctor);
    console.log('data:',data);
    
    res
      .status(HttpStatusCodes.OK)
      .json({ slotDetails: data, user_count: user, doctor_count: doctor });
  } catch (error) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  adminLogin,
  doctorStatusChange,
  doctordata,
  doctorBlock,
  getKycDetailsOfDoctor,
  submitKycDetails,
  downloadKycDocuments,
  userdata,
  userBlock,
  userDetails,
  kycDataCollection,
  searchUser,
  getSpecialization,
  addSpecialization,
  editSpecialization,
  deleteSpecialization,
  editpayOut,
  getAppointmentDetails,
  getAdminDashboardDetails,
};

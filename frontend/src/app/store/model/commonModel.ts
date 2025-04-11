// import { ObjectId } from 'mongoose';

import { usermodel } from "./usermodel";

// interface Slot {
//   docId: ObjectId;
//   time: Date;
//   booked?: boolean;
//   bookingAmount: number;
//   adminPaymentAmount: number;
//   cancelled?: boolean;
//   created_time: Date;
// }

export interface HttpResponseModel{
    message:string,
    error:string,
    slot?:Object,
}

export interface otpdata{
    email:string,
    new_email?:string|null,
    otp:string,
    role?:string
  }

export interface UpdatePasswordRequest{
    email:string,
    password:string
}

export interface ChartOptions {
    maintainAspectRatio: boolean;
    aspectRatio: number;
    plugins: {
      legend: {
        labels: {
          color: string;
        };
      };
    };
    scales: {
      x: {
        ticks: {
          color: string;
        };
        grid: {
          color: string;
        };
      };
      y: {
        ticks: {
          color: string;
        };
        grid: {
          color: string;
        };
      };
    };
  }

  export interface UserModel{
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      otp: number;
      otp_update_time: string;
      is_verified: string;
      role: string;
      blocked: string;
      created_time: string;
      wallet: number;
      profile_picture?: string;
      refreshToken: string | null;
      __v: number;
  }

  export interface SpecializationModel {
    _id: string;
    specialization: string;
    __v: number;
  }

  export interface SlotModel {
    _id: string;
    docId: string;
    time: string;
    booked: boolean;
    bookingAmount: string; //changed from number to string
    adminPaymentAmount: number;
    cancelled: boolean;
    created_time: string;
    status: 'available' | 'pending' | 'booked';
    reservedBy: string | null ; 
    reservedAt: string | null;
    __v: number;
  }
  
  export interface DoctorModel {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    contactno: number;
    profile_picture?: string;
    specialization: string;
    current_working_hospital_address: string;
    experience: string;
    consultation_fee: number;
    qualification_certificate: string[];
    experience_certificate: string[];
    doctors_liscence: string;
    identity_proof_type: string;
    identity_proof: string;
    password: string;
    kyc_verification: string;
    blocked: string;
    created_time: string;
    otp: number;
    otp_update_time: string;
    otp_verification: boolean;
    __v: number;
  }
  export interface SlotModelPopulate {
    _id: string;
    docId: DoctorModel;
    time: string;
    booked: boolean;
    bookingAmount: string; //change from num to str
    adminPaymentAmount: number;
    cancelled: boolean;
    created_time: string;
    status: 'available' | 'pending' | 'booked';
    reservedBy: string | null |UserModel; 
    reservedAt: string | null;
    __v: number;
  }

  export interface PrescriptionModel {
    _id: string;
    bookedSlot: string|BookedSlotModel; // or BookedSlot if populated
    disease: string;
    prescription: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  export interface PrescriptionModelPopulate {
    _id: string;
    bookedSlot: BookedSlotModel; // or BookedSlot if populated
    disease: string;
    prescription: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  export interface BookedSlotModel {
    _id: string;
    userId: string; // or User if populated
    slotId: string; // or Slot if populated
    doctorId: string; // or Doctor if populated
    payment_method: string;
    payment_status: boolean;
    consultation_status: string;
    patient_details?: {
      name?: string;
      email?: string;
      age?: number;
      gender?: string;
      address?: string;
      reason_for_visit?: string;
    };
    created_time: string;
    roomId?: string;
    prescription_id?: string; // or Prescription if populated
    __v: number;
    dateOfBooking?:Date;
  }
  export interface BookedSlotModelPopulate {
    _id: string;
    userId: UserModel; // or User if populated
    slotId: SlotModelPopulate; // or Slot if populated
    doctorId: DoctorModel; // or Doctor if populated
    payment_method: string;
    payment_status: boolean;
    consultation_status: string;
    patient_details?: {
      name?: string;
      email?: string;
      age?: number;
      gender?: string;
      address?: string;
      reason_for_visit?: string;
    };
    created_time: string;
    roomId?: string;
    prescription_id?: PrescriptionModel; // or Prescription if populated
    __v: number;
    dateOfBooking?:Date;
  }

  export interface MessageModal {
    _id: string;
    sender: string; // or User | Doctor if populated
    senderModel: "usercollection" | "doctorcollection";
    content: string;
    chat: string|ChatModel; // or Chat if populated
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  export interface MessageModalUserPopulate {
    _id: string;
    sender: UserModel; // or User | Doctor if populated
    senderModel: "usercollection" | "doctorcollection";
    content: string;
    chat: string|ChatModel; // or Chat if populated
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  export interface MessageModalDoctorPopulate {
    _id: string;
    sender: DoctorModel; // or User | Doctor if populated
    senderModel: "usercollection" | "doctorcollection";
    content: string;
    chat: string|ChatModel; // or Chat if populated
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  export interface DocKycModel {
    _id: string;
    docId: string|DoctorModel; 
    exp_certificate: string;
    qualification_certificate: string;
    doc_liscence: string;
    id_proof_type: string;
    id_proof: string;
    specialization: string;
    curr_work_hosp: string;
    created_time: string;
    __v: number;
  }
  export interface DocKycModelPopulate {
    _id: string;
    docId: DoctorModel; 
    exp_certificate: string;
    qualification_certificate: string;
    doc_liscence: string;
    id_proof_type: string;
    id_proof: string;
    specialization: string;
    curr_work_hosp: string;
    created_time: string;
    __v: number;
  }
  
  export interface ChatModel {
    _id: string;
    chatName: string;
    user: string|UserModel;
    doctor: string|DoctorModel; 
    latestMessage?: string|MessageModal; // or Message if populated
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  export interface ChatModelPopulate {
    _id: string;
    chatName: string;
    user: UserModel;
    doctor: DoctorModel; 
    latestMessage?: MessageModal; // or Message if populated
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  export interface ChatModelPopulate {
    _id: string;
    chatName: string;
    user: UserModel;
    doctor: DoctorModel; 
    latestMessage?: MessageModal; // or Message if populated
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  export interface AdminModel {
    _id: string;
    email: string;
    password: string;
    role: string;   
    payOut: number;
    __v: number;
  }
  
  
import { adminInfo } from "../store/admin.state"

export interface HttpResponseModel{
    message:string,
    error:string
}

export interface adminLoginResponse{
    accessToken:string,
    accessedUser:adminInfo,
    message:string
}
interface DashboardData {
    slotDetails: slotDetails[];
    user_count: number;
    doctor_count: number;
  }

export interface appointmentHistory {
    _id: string;
    userId: userDetails;
    slotId: slotDetails;
    doctorId: string;
    payment_method: 'online_payment' | 'wallet_payment';
    payment_status: boolean;
    consultation_status: 'pending' | 'cancelled' | string;
    created_time: Date;
    __v: number;
    roomID?: string;
    patient_details?: patientDetails;
  }
  
  export interface userDetails {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    otp: number;
    otp_update_time: Date;
    is_verified: 'true' | 'false';
    role: string;
    blocked: 'true' | 'false';
    created_time: Date;
    __v: number;
    wallet: number;
    profile_picture: string;
    refreshToken?:{
        type: String
      }
  }
  
  export interface slotDetails {
    status: 'available' | 'booked' | string;
    reservedBy: string | null;
    reservedAt: Date | null;
    _id: string;
    docId: doctorDetails; // You can make this more specific if the object structure is known
    time: Date;
    booked: boolean;
    bookingAmount: number;
    adminPaymentAmount: number;
    cancelled: boolean;
    created_time: Date;
    __v: number;
  }
  
  export interface patientDetails {
    name: string;
    email: string;
    age: number;
    gender: 'male' | 'female' | string;
    address: string;
    reason_for_visit: string;
  }
  export interface doctorDetails {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    contactno: number;
    profile_picture: string;
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
    kyc_verification: string; // could be changed to boolean if you convert 'true'/'false' to real booleans
    blocked: string;          // same as above
    created_time: Date;
    otp: number;
    otp_update_time: Date;
    otp_verification: boolean;
    __v: number;
  }
  
  
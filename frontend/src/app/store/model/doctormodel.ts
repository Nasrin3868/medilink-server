export interface doctor{
    firstNmae:string,
    lastName:string,
    email:string,
    contactno:string,
    specialization:string,
    current_working_hospital_address:string,
    experience:string,
    consultation_fee:string,
    identity_proof_type:string,
    identity_proof:File,
    doctors_liscence:File,
    qualification_certificate:File,
    experience_certificate:File,
    password:string
}

//getting data when login success
export interface doctorLoginResponseModel{
    accessToken:string,
    accessedUser:doctorInfo,
    message:string,
    email?:string
}

// store setting
export interface doctorInfo{
    _id:string,
    firstName:string,
    lastName:string,
    email:string,
    role:string
}

//login model
export interface loginModel{
    email:string,
    password:string
}

export type upcomingAppointment={
    doctorId:string
}

export interface email{
    email:string
}


export interface doctorData{
    _id?:string,
    firstName:string,
    lastName:string,
    email:string,
    contactno:Number,
    profile_picture?:string,
    specialization:string,
    current_working_hospital_address:string,
    experience:string,
    consultation_fee:Number,
    qualification_certificate?:[string],
    experience_certificate?:[string],
    doctors_liscence?:string,
    identity_proof_type?:string,
    identity_proof?:string,
    kyc_verification?:string,
    blocked?:string
}

export interface kyc_verification{
    _id:string,
    docId:doctorData,
    exp_certificate:string,
    qualification_certificate:string,
    doc_liscence:string,
    id_proof_type:string
    id_proof:string,
    specialization:string,
    curr_work_hosp:string,
}

export interface specialization{
    _id:string,
    specialization:string
}
export const doctor_state={
    doctorInfo:{
        _id:'',
        firstName:'',
        lastName:'',
        email:'',
        role:'',
    }
}

export interface doctor_state{
    doctorInfo: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
    };
}

export const initialDoctorState: doctor_state = {
    doctorInfo: {
        _id: '',
        firstName: '',
        lastName: '',
        email: '',
        role: '',
    }
};

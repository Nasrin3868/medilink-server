import { createReducer, on } from "@ngrx/store";
import { doctor_state, initialDoctorState } from "./doctor.state";
import { loginDoctorSuccess, logoutDoctor } from "./doctor.Action";


// const _doctorReducer=createReducer(doctor_state,
    const _doctorReducer=createReducer(initialDoctorState,
    on(loginDoctorSuccess,(state,action)=>{
        const doctor={...action.data}
        return {
            ...state,
            doctorInfo:{
                _id:doctor._id,
                firstName:doctor.firstName,
                lastName:doctor.lastName,
                email:doctor.email,
                role:doctor.role
            }
        }
    }),
    on(logoutDoctor,(state)=>{
        return {
            ...state,
            doctorInfo:{
                _id:'',
                firstName:'',
                lastName:'',
                email:'',
                role:''            
            }
        }
    })
)
export function doctorReducer(state:any,action:any){
    return _doctorReducer(state,action)
}
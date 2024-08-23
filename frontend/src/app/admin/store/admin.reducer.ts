import { state } from "@angular/animations"
import { createReducer, on } from "@ngrx/store"
import { doctor_state } from "src/app/store/doctor/doctor.state"
import { loginadminSuccess } from "./admin.action"


const _adminReducer=createReducer(doctor_state,
    on(loginadminSuccess,(state,action)=>{
        const admin={...action.data}
        console.log('admin reducer')
        return {
            ...state,
            adminInfo:{
            _id:admin._id,
            email:admin.email,
            role:admin.role,
            payOut:admin.payOut
            }
        }
    })
)

export function adminReducer(state:any,action:any){
    return _adminReducer(state,action)
}
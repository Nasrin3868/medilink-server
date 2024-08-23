import { createAction, props } from "@ngrx/store"
import { loginModel, userInfo } from "../model/usermodel"
import { doctorInfo } from "../model/doctormodel"

export const login_doctor='[doctor_page]load doctor'
export const login_doctor_success='[doctor page]load doctor success'
export const logout_doctor='[doctor_page]load doctor'

export const loginDoctor=createAction(login_doctor,props<{data:loginModel}>())
export const loginDoctorSuccess=createAction(login_doctor_success,props<{data:doctorInfo}>())
export const logoutDoctor=createAction(logout_doctor)
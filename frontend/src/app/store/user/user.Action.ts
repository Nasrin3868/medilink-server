import { createAction, props } from "@ngrx/store"
import { loginModel, user, userInfo, usermodel } from "../model/usermodel"


export const login_user='[user page]load user'
export const login_user_success='[user page]load user success'
export const logout_user='[user page]logout user'


export const loginUser=createAction(login_user,props<{data:loginModel}>())
export const loginUserSuccess=createAction(login_user_success,props<{data:userInfo}>())
export const logoutUser=createAction(logout_user)
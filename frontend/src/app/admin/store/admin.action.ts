import { createAction, props } from "@ngrx/store"
import { Adminlogin, adminInfo } from "./admin.state"

export const login_admin='[admin_page]load admin'
export const login_admin_success='[admin page]load admin success'
export const logout_admin='[admin_page]load admin'

export const adminlogin=createAction(login_admin,props<{data:Adminlogin}>())
// export const loginadminSuccess=createAction(login_admin_success,props<{data:adminInfo}>())
export const loginadminSuccess=createAction(login_admin_success,props<{data:adminInfo}>())
export const logoutadmin=createAction(logout_admin)
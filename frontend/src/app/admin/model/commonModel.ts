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
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { loginModel, loginResponseModel, user, userInfo } from '../store/model/usermodel';
import { Observable } from 'rxjs';
import { HttpResponseModel, UpdatePasswordRequest } from '../store/model/commonModel';
import { doctorData, specialization } from '../admin/model/docotrModel';
import { environment } from 'src/environments/environment';
import { otpdata } from '../store/model/commonModel';

@Injectable({
  providedIn: 'root'
})
export class UserserviceService {

  constructor(private _http: HttpClient) { }

  private _api: String =environment.api

    //register user
    // userRegister(data: any): Observable<HttpResponseModel> {
    //   console.log('userRegister services')
    //   return this._http.post<HttpResponseModel>(`${this._api}/user/userregister`, data);
    // }

    userRegister(data:Object):Observable<HttpResponseModel>{
      return this._http.post<HttpResponseModel>(`${this._api}/user/userRegister`,data)
    }

  //resendotp
  resendOtp(email: Object): Observable<HttpResponseModel> {
    console.log('resend otp')
    return this._http.post<HttpResponseModel>(`${this._api}/user/resendOtp`, email)
  }

  //verifyOtp
  verifyOtp(data: otpdata): Observable<HttpResponseModel> {
    console.log('verify otp service')
    return this._http.post<HttpResponseModel>(`${this._api}/user/verifyOtp`, data)
  }

  //login user
  userLogin(data: loginModel): Observable<loginResponseModel> {
    return this._http.post<loginResponseModel>(`${this._api}/user/login`, data)
  }

  //verifyEmail_Forgetpassword
  verifyEmail(data: Object): Observable<HttpResponseModel> {
    return this._http.post<HttpResponseModel>(`${this._api}/user/verifyEmail`, data)
  }

  //newPassword
  updatePassword(data: UpdatePasswordRequest): Observable<HttpResponseModel> {
    return this._http.post<HttpResponseModel>(`${this._api}/user/updatePassword`, data)
  }

  //get user profile
  getuserDetails(data: any): Observable<userInfo> {
    console.log('user profile _api')
    const httpParams = new HttpParams({ fromObject: data })
    return this._http.get<userInfo>(`${this._api}/user/getuserDetails`, { params: httpParams })
  }

  edit_user_profile_picture(data:Object): Observable<HttpResponseModel>{
    return this._http.post<HttpResponseModel>(`${this._api}/user/edit_user_profile_picture`, data)
  }

  editUserProfile_name(data: Object): Observable<HttpResponseModel> {
    console.log('edit UserProfile_name service');
    return this._http.post<HttpResponseModel>(`${this._api}/user/editUserProfile_name`, data)
  }

  opt_for_new_email(data:Object): Observable<HttpResponseModel> {
    console.log('edit opt_for_new_email service');
    return this._http.post<HttpResponseModel>(`${this._api}/user/opt_for_new_email`, data)
  }

  getSpecialization(): Observable<specialization[]> {
    return this._http.get<specialization[]>(`${this._api}/user/getSpecialization`)
  }

  getDoctors(): Observable<doctorData[]> {
    return this._http.get<doctorData[]>(`${this._api}/user/getDocotrs`)
  }

  getdoctorDetails(data: any): Observable<doctorData> {
    const httpParams = new HttpParams({ fromObject: data })
    return this._http.get<doctorData>(`${this._api}/user/getDoctorDetails`, { params: httpParams })
  }

  getSlots(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data })
    return this._http.get<any>(`${this._api}/user/getSlots`, { params: httpParams })
  }

  addSlot(data: Object): Observable<any> {
    return this._http.post<any>(`${this._api}/user/addSlots`, data)
  }

  //get a particular slot
  getSlot(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data })
    return this._http.get<any>(`${this._api}/user/getSlot`, { params: httpParams })
  }

  //submit appointmnet letter
  appointmnet_booking(data: Object): Observable<any> {
    return this._http.post<any>(`${this._api}/user/appointmnet_booking`, data)
  }

  check_if_the_slot_available(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data })
    console.log('httpParams contains slotId:',httpParams)
    return this._http.get<any>(`${this._api}/user/check_if_the_slot_available`, { params: httpParams })
  }

  //payment for slot booking
  booking_payment(data: Object): Observable<any> {
    console.log('razorpay booking service');
    return this._http.post<any>(`${this._api}/user/booking_payment`, data)
  }

  userDetails(data: any): Observable<any> {
    console.log('wallet_details service');
    const httpParams = new HttpParams({ fromObject: data })
    return this._http.get<any>(`${this._api}/user/userDetails`, { params: httpParams })
  }

  //get booking details of this user
  get_booking_details_of_user(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data })
    console.log('data', FormDataEvent);
    return this._http.get<any>(`${this._api}/user/get_booking_details`, { params: httpParams })
  }

  //to cancel slot
  cancelSlot(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data })
    return this._http.get<any>(`${this._api}/user/cancelSlot`, { params: httpParams })
  }

  upcoming_appointment(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data })
    return this._http.get<any>(`${this._api}/user/upcoming_appointment`, { params: httpParams })
  }

  getUpcomingSlot(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data })
    return this._http.get<any>(`${this._api}/user/getUpcomingSlot`, { params: httpParams })
  }

  prescription_history(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data })
    return this._http.get<any>(`${this._api}/user/prescription_history`, { params: httpParams })
  }

  get_prescription_details(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data })
    return this._http.get<any>(`${this._api}/user/get_prescription_details`, { params: httpParams })
  }
  get_bookings_of_user(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data })
    return this._http.get<any>(`${this._api}/user/get_bookings_of_user`, { params: httpParams })
  }

}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { doctor, doctorLoginResponseModel, upcomingAppointment } from '../store/model/doctormodel';
import { HttpResponseModel, UpdatePasswordRequest } from '../store/model/commonModel';
import { loginModel } from '../store/model/usermodel';
import { doctorData, specialization } from '../admin/model/docotrModel';
import { environment } from 'src/environments/environment';
import { otpdata } from '../store/model/commonModel';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private _http: HttpClient) { }

  private _api: String =environment.api
  
  //doctor registration
  doctorRegister(data: FormData): Observable<HttpResponseModel> {
    return this._http.post<HttpResponseModel>(`${this._api}/doctor/registration`, data)
  }

  getSpecialization(): Observable<specialization> {
    return this._http.get<specialization>(`${this._api}/doctor/getSpecialization`)
  }

  //doctor login
  doctorLogin(data: loginModel): Observable<doctorLoginResponseModel> {
    return this._http.post<doctorLoginResponseModel>(`${this._api}/doctor/login`, data)
  }

  //verifyEmail_Forgetpassword
  verifyEmail(data: Object): Observable<HttpResponseModel> {
    return this._http.post<HttpResponseModel>(`${this._api}/doctor/verifyEmail`, data)
  }

  //resendotp
  resendOtp(email: Object): Observable<HttpResponseModel> {
    return this._http.post<HttpResponseModel>(`${this._api}/doctor/resendOtp`, email)
  }

  //verifyOtp
  verifyOtp(data: otpdata): Observable<HttpResponseModel> {
    return this._http.post<HttpResponseModel>(`${this._api}/doctor/verifyOtp`, data)
  }

  //newPassword
  updatePassword(data: UpdatePasswordRequest): Observable<HttpResponseModel> {
    return this._http.post<HttpResponseModel>(`${this._api}/doctor/updatePassword`, data)
  }

  //get doc details
  getDoctorDetails(data: { _id: string }): Observable<doctorData> {
    const httpParams = new HttpParams({ fromObject: data })
    return this._http.get<doctorData>(`${this._api}/doctor/getDoctorDetails`, { params: httpParams })
  }

  //edit doc profile
  editDoctorProfile(data: Object): Observable<HttpResponseModel> {
    return this._http.post<HttpResponseModel>(`${this._api}/doctor/editDoctorProfile`, data)
  }

  edit_doctor_profile_picture(data: Object): Observable<HttpResponseModel> {
    return this._http.post<HttpResponseModel>(`${this._api}/doctor/edit_doctor_profile_picture`, data)
  }

  opt_for_new_email(data:Object): Observable<HttpResponseModel> {
    console.log('edit opt_for_new_email service');
    return this._http.post<HttpResponseModel>(`${this._api}/doctor/opt_for_new_email`, data)
  }

  //get slots for doctor
  getSlots(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data })
    return this._http.get<any>(`${this._api}/doctor/doctorSlotDetails`, { params: httpParams })
  }

  //add slot for doctor
  addSlots(data: Object): Observable<HttpResponseModel> {
    return this._http.post<HttpResponseModel>(`${this._api}/doctor/slotCreation`, data)
  }

  add_all_slots(data: any): Observable<any> {
    return this._http.post<any>(`${this._api}/doctor/add_all_slots`, data);
  }

  removeSlot(data: any): Observable<HttpResponseModel> {
    const httpParams = new HttpParams({ fromObject: data })
    return this._http.delete<HttpResponseModel>(`${this._api}/doctor/RemoveSlot`, { params: httpParams })
  }

  get_booking_details_of_doctor(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data })
    return this._http.get<any>(`${this._api}/doctor/get_booking_details`, { params: httpParams })
  }

  get_bookings_of_doctor(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data })
    return this._http.get<any>(`${this._api}/doctor/get_bookings_of_doctor`, { params: httpParams })
  }

  get_doctor_dashboard_details(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data })
    return this._http.get<any>(`${this._api}/doctor/get_doctor_dashboard_details`, { params: httpParams })
  }

  upcomingAppointment(data: upcomingAppointment): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data })
    return this._http.get<any>(`${this._api}/doctor/upcoming_appointment`, { params: httpParams })
  }

  updateUpcomingSlot(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data })
    return this._http.get<any>(`${this._api}/doctor/updateUpcomingSlot`, { params: httpParams })
  }

  update_consultationStatus(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data })
    return this._http.get<any>(`${this._api}/doctor/update_consultationStatus`, { params: httpParams })
  }

  add_prescription(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data })
    return this._http.get<any>(`${this._api}/doctor/add_prescription`, { params: httpParams })
  }

  share_roomId_through_email(data: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: data })
    return this._http.get<any>(`${this._api}/doctor/share_roomId_through_email`, { params: httpParams })
  }



}

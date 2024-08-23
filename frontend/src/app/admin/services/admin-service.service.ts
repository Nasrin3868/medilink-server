import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Adminlogin } from '../store/admin.state';
import { HttpResponseModel, adminLoginResponse } from '../model/commonModel';
import { Observable } from 'rxjs';
import { doctorData, kyc_verification, specialization } from '../model/docotrModel';
import { userdata } from '../model/usermodel';
import { AnyFn } from '@ngrx/store/src/selector';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {
  private api: String =environment.api


  constructor(private _http:HttpClient) { }

  //admin login
  adminLogin(data:Adminlogin):Observable<adminLoginResponse>{
    return this._http.post<adminLoginResponse>(`${this.api}/admin/adminLogin`,data)
  }

  //get all the doctor details
  getDoctors(params: { [key: string]: string }): Observable<doctorData[]> {
    let httpParams = new HttpParams();
    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this._http.get<doctorData[]>(`${this.api}/admin/doctordata`, { params: httpParams });
  }

  //change the status of a doctor
  doctorBlock(data:Object):Observable<HttpResponseModel>{
    console.log('doctor block service:',data)
    return this._http.post<HttpResponseModel>(`${this.api}/admin/doctorBlock`,data)
  }

  //get all the users
  getUsers():Observable<userdata[]>{
    return this._http.get<userdata[]>(`${this.api}/admin/userdata`)
  }

  //change status of user
  userBlock(data:Object):Observable<HttpResponseModel>{
    return this._http.post<HttpResponseModel>(`${this.api}/admin/userBlock`,data)
  }

  //get a single user
  userDetails(data:Object):Observable<userdata>{
    console.log('userDetails service:',data)
    return this._http.post<userdata>(`${this.api}/admin/userDetails`,data)
  }

  //kyc data fetching
  kycdata():Observable<kyc_verification[]>{
    console.log('kyc details');
    return this._http.get<kyc_verification[]>(`${this.api}/admin/kycDataCollection`)
  }

  //userlist-search
  searchUser(data:Object):Observable<userdata[]>{
    console.log('search user service:',data);
    return this._http.post<userdata[]>(`${this.api}/admin/searchUser`,data)
  }

  //get specialization
  getSpecialization():Observable<specialization[]>{
    console.log('get specialization Service');
    return this._http.get<specialization[]>(`${this.api}/admin/getSpecialization`)
  }

  //add specialization
  addSpecialization(data:Object):Observable<HttpResponseModel>{
    console.log('add specialization Service:',data);
    return this._http.post<HttpResponseModel>(`${this.api}/admin/addSpecialization`,data)
  }

  //edit specialization
  editSpecialization(data:specialization):Observable<HttpResponseModel>{
    console.log('edit specialization Service');
    return this._http.post<HttpResponseModel>(`${this.api}/admin/editSpecialization`,data)
  }

  //delete specialization
  deleteSpecialization(data:any):Observable<HttpResponseModel>{
    console.log('delete specialization Service');
    const httpParams=new HttpParams({fromObject:data})
    return this._http.delete<HttpResponseModel>(`${this.api}/admin/deleteSpecialization`,{params:httpParams})
  }

  //edit payOut
  editpayOut(data:Object):Observable<HttpResponseModel>{
    console.log('delete specialization Service');
    return this._http.post<HttpResponseModel>(`${this.api}/admin/editpayOut`,data)
  }

  //get a doctor details
  get_doctor_kyc_details_from_id(data:any):Observable<doctorData>{
    console.log('doc detail Service');
    const httpParams=new HttpParams({fromObject:data})
    return this._http.get<doctorData>(`${this.api}/admin/get_kyc_details_of_doctor`,{params:httpParams})
  }

  submit_kyc_details(data:any):Observable<HttpResponseModel>{
    console.log('doc detail Service');
    return this._http.post<HttpResponseModel>(`${this.api}/admin/submit_kyc_details`,data)
  }

  download_kyc_documents(data:any):Observable<HttpResponseModel>{
    console.log('download_kyc_documents Service');
    const httpParams=new HttpParams({fromObject:data})
    return this._http.get<HttpResponseModel>(`${this.api}/admin/download_kyc_documents`,{params:httpParams})
  }

  //getAppointment
  getAppointment():Observable<any>{
    return this._http.get<any>(`${this.api}/admin/get_appointment_details`)
  }

  get_admin_dashboard_details(data:any):Observable<any>{
    console.log('service call of get_booking_details_of_doctor');
    const httpParams=new HttpParams({fromObject:data})
    return this._http.get<any>(`${this.api}/admin/get_admin_dashboard_details`,{params:httpParams})
  }

}

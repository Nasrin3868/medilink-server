import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponseModel } from '../store/model/commonModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private _http: HttpClient) { }

  private _api: String =environment.api

  //access chat userSide 
  accessChat(data: any): Observable<any> {
    console.log('access chat from userSide');
    const httpParams = new HttpParams({ fromObject: data })
    return this._http.get(`${this._api}/user/userAccessChat`, { params: httpParams })
  }

  //userFetchAllChat
  userFetchAllChat(data: any): Observable<any> {
    console.log('userFetchAllChat from userSide');
    const httpParams = new HttpParams({ fromObject: data })
    return this._http.get(`${this._api}/user/userFetchAllChat`, { params: httpParams })
  }

  //send message service userSide
  sendMessage(data: Object): Observable<any> { //any refer the chat interface
    console.log('send message from user service')
    return this._http.post<any>(`${this._api}/user/sendMessage`, data)
  }

  //userFetchAllMessages
  userFetchAllMessages(data: any): Observable<any> {
    console.log('userFetchAllMessages from userSide');
    const httpParams = new HttpParams({ fromObject: data })
    return this._http.get(`${this._api}/user/userFetchAllMessages`, { params: httpParams })
  }

  //doctor_accessed_chats
  doctor_accessed_chats(data: any): Observable<any> {
    console.log('doctor_accessed_chats from userSide');
    const httpParams = new HttpParams({ fromObject: data })
    return this._http.get(`${this._api}/doctor/doctor_accessed_chats`, { params: httpParams })
  }

  doctorFetchAllMessages(data: any): Observable<any> {
    console.log('doctorFetchAllMessages from userSide');
    const httpParams = new HttpParams({ fromObject: data })
    return this._http.get(`${this._api}/doctor/doctorFetchAllMessages`, { params: httpParams })
  }

  doctorSendMessage(data: Object): Observable<any> { //any refer the chat interface
    console.log('send message from doctor service')
    return this._http.post<any>(`${this._api}/doctor/doctorSendMessage`, data)
  }
}

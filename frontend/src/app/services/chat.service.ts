import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponseModel } from '../store/model/commonModel';
import { environment } from 'src/environments/environment';
import { ChatAccessData } from '../store/model/usermodel';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private _http: HttpClient) { }

  private _api: String =environment.api

  //access chat userSide 
    accessChat(data: ChatAccessData): Observable<any> {
      console.log('access chat from userSide');
      const httpParams = new HttpParams({ fromObject:  { userId: data.userId.toString() } })
      return this._http.get(`${this._api}/user/userAccessChat`, { params: httpParams })
    }

  //userFetchAllChat
  userFetchAllChat(data: ChatAccessData): Observable<any> {
    console.log('userFetchAllChat from userSide');
    const httpParams = new HttpParams({ fromObject:  { userId: data.userId.toString() } })
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

  //doctorAccessedChats
  doctorAccessedChats(data: any): Observable<any> {
    console.log('doctorAccessedChats from userSide');
    const httpParams = new HttpParams({ fromObject: data })
    return this._http.get(`${this._api}/doctor/doctorAccessedChats`, { params: httpParams })
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

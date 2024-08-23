import { Injectable } from '@angular/core';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _commonService: CommonService) { }

  checkUserLoggedIn(): boolean {
    const userLoggedIn = this._commonService.getTokenFromLocalStorage()
    return !!userLoggedIn
  }

  checkDoctorLoggedIn(): boolean {
    const doctorLoggedIn = this._commonService.getDoctorTokenFromLocalStorage()
    return !!doctorLoggedIn
  }


}

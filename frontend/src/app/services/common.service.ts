
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }


  // get the email from local storage for the resend otp action
  getEmailFromLocalStrorage(): string {
    return localStorage.getItem('email') as string
  }

  //get the role from local storage for the verify otp action
  getRoleFromLocalStorage(): string {
    return localStorage.getItem('role') as string
  }

  //get userToken from the local storage
  getTokenFromLocalStorage(): string {
    return localStorage.getItem('userToken') as string
  }

  //get doctorToken from the local storage
  getDoctorTokenFromLocalStorage(): string {
    return localStorage.getItem('doctorToken') as string
  }

  //get doctor Id from local storage
  getDoctorIdFromLocalStorage(): string {
    return localStorage.getItem('doctorId') as string
  }

  //get to know is user is there or not
  user_verify(): boolean {
    const userLoggedIn = this.getTokenFromLocalStorage()
    return !!userLoggedIn
  }

  //get auth from local storage to do the verifications
  getAuthFromLocalStorage(): string {
    return localStorage.getItem('auth') as string
  }

  

}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {

  constructor() { }

  admin_Auth=localStorage.getItem('adminToken')
  
  check_admin_logged_in():boolean{
    if(this.admin_Auth){
      return true
    }else{
      return false
    }
  }

}

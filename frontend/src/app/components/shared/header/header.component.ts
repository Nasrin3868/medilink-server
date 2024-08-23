import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { logoutDoctor } from 'src/app/store/doctor/doctor.Action';
import { logoutUser } from 'src/app/store/user/user.Action';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  // check_user!:boolean;
  user!:boolean
  doctor!:boolean
  nobody!:boolean

  constructor(
    private _commonService:CommonService,
    private _router:Router,
    private _store:Store,
    private _authService:AuthService
  ){}
  ngOnInit(){
    this.checkuser()
  }

  checkuser(){
    const user=this._authService.checkUserLoggedIn()
    const doctor=this._authService.checkDoctorLoggedIn()
    if(user){
      this.user=true
      this.doctor=false
      this.nobody=false
    }else if(doctor){
      this.doctor=true
      this.user=false
      this.nobody=false
    }else if(!user&&!doctor){
      this.nobody=true
      this.user=false
      this.doctor=false
    }
  }

  home(){
    this._router.navigate(['/home'])
  }

  doctor_signIn(){
    localStorage.setItem('auth','doctor')
    console.log(this._commonService.getAuthFromLocalStorage())
    this._router.navigate(['/doctor/doctor_login'])
  }

  userlogin(){
    localStorage.setItem('auth','user')
    console.log(this._commonService.getAuthFromLocalStorage())
    this._router.navigate(['/user/login'])
  }

  userHome(){
    this._router.navigate(['/user/userHome'])
  }

  userProfile(){
    this._router.navigate(['/user/user_profile'])
  }

  userChat(){
    this._router.navigate(['/user/userchat'])
  }

  doctorListing(){
    this._router.navigate(['/user/doctor_listing'])
  }

  doctorProfile(){
    this._router.navigate(['/doctor/doctor_profile'])
  }

  doctorChat(){
    this._router.navigate(['/doctor/doctor_chat'])
  }
  doctorHome(){
    this._router.navigate(['/doctor/doctorHome'])
  }
  bookings(){
    this._router.navigate(['doctor/bookings'])
  }
  userLogout(){
    if(this._authService.checkUserLoggedIn()){
      // this._store.dispatch(logoutUser())
      localStorage.removeItem('userToken')
      this._router.navigate(['/home'])
      localStorage.removeItem('auth')
    }else if(this._authService.checkDoctorLoggedIn()){
      // this._store.dispatch(logoutDoctor())
      localStorage.removeItem('doctorToken')
      this._router.navigate(['/home'])
      localStorage.removeItem('auth')
    }
  }
}



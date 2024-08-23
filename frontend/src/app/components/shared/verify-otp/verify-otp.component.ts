import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { UserserviceService } from 'src/app/services/userservice.service';
import { otpPattern } from '../regular_expressions/regular_expressions';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css']
})
export class VerifyOtpComponent implements OnInit{
  timerInterval: any;
  counter: number = 59;
  email=this._commonservice.getEmailFromLocalStrorage()
  new_email=localStorage.getItem('new_email')
  role=this._commonservice.getRoleFromLocalStorage()

  constructor(
    private _formbuilder:FormBuilder,
    private _commonservice:CommonService,
    private _userService:UserserviceService,
    private _showMessage:MessageToasterService,
    private _router:Router,
    private _doctorService:DoctorService
  ){}

  ngOnInit(){
    this.counterFn();
  }

  otpForm = this._formbuilder.group({
    otp: ['', [Validators.required, Validators.pattern(otpPattern)]],
  });

  counterFn(){
    this.timerInterval=setInterval(()=>{
      this.counter--
      if(this.counter===0){
        clearInterval(this.timerInterval)
      }
    },1000)
  }

  resendClicked(){
    this.counter=59
    this.counterFn()
    if(this._commonservice.getAuthFromLocalStorage()==='doctor'){
      this._doctorService.resendOtp({email:this.email}).subscribe({
        next:(response)=>{
          this._showMessage.showSuccessToastr(response.message)
          this.otpForm.reset()
        }
      })
    }else{
      this._userService.resendOtp({email:this.email}).subscribe({
        next:(response)=>{
          this._showMessage.showSuccessToastr(response.message)
          this.otpForm.reset()
        }
      })
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onSubmit(){
    if(this.otpForm.invalid){
      this.markFormGroupTouched(this.otpForm);
      return;
    }else{  
      let otpdata
      console.log(this.role);
      
      if(this.role==='user_new_email'||this.role==='doctor_new_email'){
        otpdata={
          email:this.email,
          new_email:this.new_email,
          otp:this.otpForm.value.otp as string,
          role:this.role
        }
      }else{
        otpdata={
          email:this.email,
          otp:this.otpForm.value.otp as string
        }
      }
      console.log('otpdata:',otpdata)
      if(this._commonservice.getAuthFromLocalStorage()==='doctor'){
        this._doctorService.verifyOtp(otpdata).subscribe({
          next:(response)=>{
            if(this.role==='doctorRegistration'){
              //if it is user registration verification
              this._showMessage.showSuccessToastr(response.message)
              this._router.navigate(['/doctor/registration_completed'])
              localStorage.removeItem('email')
            }else if(this.role==='userForgetPassword'){
              //if it is password verification
              this._showMessage.showSuccessToastr(response.message)
              this._router.navigate(['/doctor/new_password'])
            }else if(this.role==='doctorVerification'||this.role==="doctor_new_email"){
              //if it is userverification or updating new email
              this._showMessage.showSuccessToastr(response.message)
              localStorage.removeItem('doctorToken')
              localStorage.removeItem('email')
              localStorage.removeItem('new_email')
              localStorage.removeItem('role')
              this._router.navigate(['/doctor/doctor_login'])
            }
          },
          error:(error)=>{
            console.log(error.error.message)
            this._showMessage.showErrorToastr(error.error.message);
          }
        })
        // this.router.navigate(['/doctor/registration_completed'])
      }else if(this._commonservice.getAuthFromLocalStorage()==='user'){
        this._userService.verifyOtp(otpdata).subscribe({
          next:(response)=>{
            console.log("role for otp:",this.role)
            if(this.role==='userRegistration'){
              //if it is user registration verification
              this._showMessage.showSuccessToastr(response.message)
              this._router.navigate(['/user/registration_completed'])
              localStorage.removeItem('email')
            }else if(this.role==='userForgetPassword'){
              //if it is password verification
              this._showMessage.showSuccessToastr(response.message)
              this._router.navigate(['/user/new_password'])
            }else if(this.role==='userVerification'||this.role==='user_new_email'){
              //if it is userverification or updating new email
              this._showMessage.showSuccessToastr(response.message)
              localStorage.removeItem('userToken')
              localStorage.removeItem('email')
              localStorage.removeItem('new_email')
              localStorage.removeItem('role')
              this._router.navigate(['user/login'])
            }
          },
          error:(error)=>{
            // console.log(error.error.message)
            this._showMessage.showErrorToastr(error.error.message);
          }
        })
      }
    }
  }

}

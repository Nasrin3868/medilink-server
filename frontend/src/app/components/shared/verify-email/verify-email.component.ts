import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { UserserviceService } from 'src/app/services/userservice.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent {
  constructor(
    private _formbuilder:FormBuilder,
    private _showMessage:MessageToasterService,
    private _userservice:UserserviceService,
    private _doctorService:DoctorService,
    private _router:Router,
    private _commonService:CommonService,
  ){}

  verifyEmailForm=this._formbuilder.group({
    email:['',[Validators.required,Validators.email]]
  })

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onSubmit(){
    if(this.verifyEmailForm.invalid){
      this.markFormGroupTouched(this.verifyEmailForm);
      return;
    }else{
      const data={
        email:this.verifyEmailForm.value.email
      }
      localStorage.setItem('role','userForgetPassword')
      if(data.email){
        localStorage.setItem('email',data.email)
      }
      
      if(this._commonService.getAuthFromLocalStorage()==='user'){
        this._userservice.verifyEmail(data).subscribe({
          next:(response)=>{
            this._showMessage.showSuccessToastr(response.message)
            this._router.navigate(['/user/verify_otp'])
          },
          error:(error)=>{
            // console.log(error.error.message)
            this._showMessage.showErrorToastr(error.error.message)
          }
        })
      }else if(this._commonService.getAuthFromLocalStorage()==='doctor'){
        this._doctorService.verifyEmail(data).subscribe({
          next:(response)=>{
            this._showMessage.showSuccessToastr(response.message)
            this._router.navigate(['/doctor/verify_otp'])
          },
          error:(error)=>{
            // console.log(error.error.message)
            this._showMessage.showErrorToastr(error.error.message)
          }
        })
      }
    }
  }

}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { UserserviceService } from 'src/app/services/userservice.service';
import { passwordPattern } from '../regular_expressions/regular_expressions';
import { UpdatePasswordRequest } from 'src/app/store/model/commonModel';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent {
  
  email=this._commonService.getEmailFromLocalStrorage()

  constructor(
    private _formBuilder:FormBuilder,
    private _showMessage:MessageToasterService,
    private _router:Router,
    private _userService:UserserviceService,
    private _commonService:CommonService,
    private _doctorService:DoctorService
  ){}

  newPasswordForm=this._formBuilder.group({
    newPassword:['',[Validators.required,Validators.pattern(passwordPattern)]],
    confirmPassword:['',[Validators.required]]
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
    if(this.newPasswordForm.invalid){
      this.markFormGroupTouched(this.newPasswordForm);
      return;
    }else{
      if(this.newPasswordForm.value.newPassword!==this.newPasswordForm.value.confirmPassword){
        this._showMessage.showErrorToastr('Passwords are not matching')
      }else{
        const data:UpdatePasswordRequest={
          email:this.email,
          password:this.newPasswordForm.value.newPassword||'',
        }
        if(this._commonService.getAuthFromLocalStorage()==='user'){
          this._userService.updatePassword(data).subscribe({
            next:(response)=>{
              localStorage.removeItem('email')
              this._showMessage.showSuccessToastr(response.message)
              this._router.navigate(['/user/login'])
            },
            error:(error)=>{
              this._showMessage.showErrorToastr(error.error.message)
            }
          })
        }else if(this._commonService.getAuthFromLocalStorage()==='doctor'){
          this._doctorService.updatePassword(data).subscribe({
            next:(Response)=>{
              localStorage.removeItem('email')
              this._showMessage.showSuccessToastr(Response.message)
              this._router.navigate(['/doctor/doctor_login'])
            },
            error:(error)=>{
              this._showMessage.showErrorToastr(error.error.message)
            }
          })
        }
      }
    }
  }

}

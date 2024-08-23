import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonService } from 'src/app/services/common.service';
import { loginDoctor } from 'src/app/store/doctor/doctor.Action';
import { loginUser } from 'src/app/store/user/user.Action';
import { passwordPattern } from '../regular_expressions/regular_expressions';

@Component({
  selector: 'app-userlogin',
  templateUrl: './userlogin.component.html',
  styleUrls: ['./userlogin.component.css']
})
export class UserloginComponent {
  loginForm!: FormGroup;
  auth!:string;
  constructor( 
    private _formbuilder: FormBuilder,
    private _router:Router,
    private _store:Store,
    private _commonService:CommonService,
  ){}

  ngOnInit(){
      this.user_login()
      this.auth=this._commonService.getAuthFromLocalStorage()
    }

  user_login(){
    this.loginForm = this._formbuilder.group({
      email:['',[Validators.required,Validators.email]],
      password:['Nasrin@123',[Validators.required,Validators.pattern(passwordPattern)]]
    });
  }

  forgetPassword(){
    if(this._commonService.getAuthFromLocalStorage()==='user'){
      this._router.navigate(['/user/verify_email'])
    }else if(this._commonService.getAuthFromLocalStorage()==='doctor'){
      this._router.navigate(['/doctor/verify_email'])
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
    if(this.loginForm.invalid){
      this.markFormGroupTouched(this.loginForm);
      return;
    }else{
      const data={
        email:this.loginForm.value.email,
        password:this.loginForm.value.password
      }
      // console.log('auth:',this.auth)
      if(this.auth==='doctor'){
        this._store.dispatch(loginDoctor({data}))
      }else if(this.auth==='user'){
        this._store.dispatch(loginUser({data}))
      }
    }
  }
  

  user_registeration(){
    if(this.auth==='doctor'){
      this._router.navigate(['/doctor/doctor_register'])
    }else if(this.auth==='user'){
      this._router.navigate(['/user/userRegister'])
    }
  }
}

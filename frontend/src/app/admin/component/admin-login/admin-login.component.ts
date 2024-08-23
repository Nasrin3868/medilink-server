import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CommonService } from 'src/app/services/common.service';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { adminlogin } from '../../store/admin.action';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  loginForm!: FormGroup;
  auth!:string;
  constructor( 
    private _formbuilder: FormBuilder,
    private _showMessage:MessageToasterService,
    private _store:Store,
    private _commonService:CommonService,
  ){}

  ngOnInit(){
    this.admin_login()
    console.log(this._commonService.getAuthFromLocalStorage())
  }

  admin_login(){
    this.loginForm = this._formbuilder.group({
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required]]
    });
  }

    
  //email error
  emailError():string{
    const email=this.loginForm.get('email')
    if(email?.errors?.['required']){
      return 'Email is required'
    }else if(email?.errors?.['email']){
      return 'Invalid Email'
    }
    return ''
  }

   //password Error
   passwordError():string{
    const password=this.loginForm.get('password')
    if(password?.errors?.['required']){
      return 'Password is required'
    }else if(password?.errors?.['pattern']){
      return 'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character (?@$!%*).'
    }
    return ''
  }

  //form submission
  onSubmit(){
    console.log('email:',this.loginForm.value.email)
    if(this.loginForm.invalid){
      if(this.emailError()){
        this._showMessage.showWarningToastr(this.emailError())
      }else if(this.passwordError()){
        this._showMessage.showWarningToastr(this.passwordError())
      }
    }else{
      const data={
        email:this.loginForm.value.email,
        password:this.loginForm.value.password
      }
      this._store.dispatch(adminlogin({data}))
    }
  }
}

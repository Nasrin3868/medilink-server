import { Injectable, OnInit } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { exhaustMap, map, catchError, of } from "rxjs";
import { DoctorService } from "src/app/services/doctor.service";
import { loginDoctor, loginDoctorSuccess } from "./doctor.Action";
import { MessageToasterService } from "src/app/services/message-toaster.service";
import { Router } from "@angular/router";
// import { Action } from "@ngrx/store";

@Injectable()

export class doctorEffects implements OnInit{
    constructor(
        private action$:Actions,
        private doctorservice:DoctorService,
        private showMessage:MessageToasterService,
        private router:Router
    ){}

    ngOnInit(){
        console.log('doctor effects')
    }
    
    _loginDoctor=createEffect(()=>
        this.action$.pipe(
            ofType(loginDoctor),
            exhaustMap((action)=>{
                console.log('Doctorlogin effects')
                return this.doctorservice.doctorLogin(action.data).pipe(
                    map((data)=>{
                        const doctordata=data
                        if (doctordata.email) {
                            console.log('userdata:', doctordata);
                            localStorage.setItem('email', doctordata.email);
                            localStorage.setItem('role', 'doctorVerification')
                            this.router.navigate(['/doctor/verify_otp'])
                            return
                        } else if(doctordata){
                            localStorage.setItem('doctorToken',doctordata.accessToken)
                            localStorage.setItem('doctorId',doctordata.accessedUser._id)
                            console.log('docId in effects:',doctordata.accessedUser._id);
                            console.log('docId in effects:',localStorage.getItem('doctorId')as string);
                            
                            this.showMessage.showSuccessToastr(doctordata.message)
                            this.router.navigate(['/doctor/doctorHome'])  //page after login--->correct it
                            return loginDoctorSuccess({data:doctordata.accessedUser})
                        }else{
                            return
                        }
                    }),
                    catchError((error)=>{
                        console.log('error.error.message:',error.error.message)
                        this.showMessage.showErrorToastr(error.error.message)
                        return of(error.message)
                    })
                )
            })
        )
    )
}
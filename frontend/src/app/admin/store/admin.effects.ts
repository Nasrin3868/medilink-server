import { Injectable, OnInit } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AdminServiceService } from "../services/admin-service.service";
import { MessageToasterService } from "src/app/services/message-toaster.service";
import { Router } from "@angular/router";
import { adminlogin, login_admin_success, loginadminSuccess } from "./admin.action";
import { catchError, exhaustMap, map, of } from "rxjs";

@Injectable()

export class adminEffects  implements OnInit{
    constructor(
        private action$:Actions,
        private adminService:AdminServiceService,
        private messageToaster:MessageToasterService,
        private router:Router
    ){}

    ngOnInit(){
        console.log('admin login effects')
    }

    _adminLogin=createEffect(()=>
        this.action$.pipe(
            ofType(adminlogin),
            exhaustMap((action)=>{
                console.log('admin login effects')
                return this.adminService.adminLogin(action.data).pipe(
                    map((data)=>{
                        console.log('data from admin efects:',data)
                        if(data.accessedUser){
                            console.log('admin accesed user:',data.accessedUser._id);
                            console.log('admin accesed user:',data.accessedUser.payOut);
                            
                            localStorage.setItem('adminToken',data.accessToken)
                            localStorage.setItem('admindetails',data.accessedUser.payOut)

                            console.log('set up local storage',localStorage.getItem('adminToken'))
                            this.messageToaster.showSuccessToastr(data.message)
                            console.log('message toster up');
                            this.router.navigate(['/admin_home'])
                            console.log('navigation up');
                            return loginadminSuccess({data:data.accessedUser})
                        }else{
                            console.log('If no data',data)
                            return
                        }
                    }),
                    catchError((error)=>{
                        console.log(error.error.message)
                        this.messageToaster.showErrorToastr(error.error.message)
                        return of(error.message)
                    })
                )
            })
        )
    )

}
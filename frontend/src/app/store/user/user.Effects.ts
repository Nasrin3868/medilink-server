    import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserserviceService } from "src/app/services/userservice.service";
import { loginUser, loginUserSuccess } from "./user.Action";
import { catchError, exhaustMap, map, of } from "rxjs";
import { MessageToasterService } from "src/app/services/message-toaster.service";
import { msg } from "../model/usermodel";
import { Router } from "@angular/router";

// import { createEffect,Actions} from '@ngrx/effects';


// import { UserserviceService } from "src/app/services/userservice.service";

@Injectable()

export class usereffects {

    constructor(
        private action$: Actions,
        private userservice: UserserviceService,
        private showMessage: MessageToasterService,
        private router: Router
    ) { }

    _loginUser = createEffect(() =>
        this.action$.pipe(
            ofType(loginUser),
            exhaustMap((action) => {
                console.log('login effects')
                return this.userservice.userLogin(action.data).pipe(
                    map((data) => {
                        const userdata = data
                        if (userdata.email) {
                            console.log('userdata:', userdata);
                            localStorage.setItem('email', userdata.email);
                            localStorage.setItem('role', 'userVerification')
                            this.router.navigate(['/user/verify_otp'])
                            return
                        } else if (userdata && userdata.accessToken && userdata.accessedUser) {
                            console.log('response from backend: userdata while login:', userdata)
                            localStorage.setItem('userToken', userdata.accessToken)
                            localStorage.setItem('userId', userdata.accessedUser._id)
                            console.log('userId:', localStorage.getItem('userId'))
                            this.showMessage.showSuccessToastr(userdata.message)
                            this.router.navigate(['/user/userHome'])  //page after login--->correct it
                            return loginUserSuccess({ data: userdata.accessedUser })
                        } else {
                            return
                        }
                    }),
                    catchError((error) => {
                        console.log('error', error)
                        console.log('error.error:', error.error)
                        console.log('error.error.message:', error.error.message)
                        this.showMessage.showErrorToastr(error.error.message)
                        return of(error.message)
                    })
                )
            })
        )
    )

}





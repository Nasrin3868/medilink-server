import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError,switchMap } from 'rxjs';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';
import { UserserviceService } from '../services/userservice.service';
import { MessageToasterService } from '../services/message-toaster.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private _commonService:CommonService,
    private _router:Router,
    private _userService:UserserviceService,
    private _messageToaster:MessageToasterService
  ) {}

  userToken!:string;
  doctorToken!:string;
  adminToken!:string;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes('cloudinary.com')) {
      console.log('Cloudinary request - skipping interceptor');
      return next.handle(request);
    }
    if (request.url.includes('/refresh_token')) {
      return next.handle(request); // don't attach token
    }
    const userToken = this._commonService.getTokenFromLocalStorage(); // User token from local storage
    const doctorToken = this._commonService.getDoctorTokenFromLocalStorage(); // Doctor token from local storage
    const adminToken = this._commonService.getAdminTokenFromLocalStorage(); // Admin token from local storage
    console.log('AdminToken in interceptor:',adminToken);
    
    let authRequest = request;
    // new code

    // Determine the token based on the path
    // let token = '';
    // let headerPrefix = '';
    // if (window.location.pathname.includes('/user')) {
    //     token = this._commonService.getTokenFromLocalStorage();
    //     headerPrefix = 'user-Bearer';
    // } else if (window.location.pathname.includes('/doctor')) {
    //     token = this._commonService.getDoctorTokenFromLocalStorage();
    //     headerPrefix = 'doctor-Bearer';
    // } else if (window.location.pathname.includes('/admin')) {
    //     token = this._commonService.getAdminTokenFromLocalStorage();
    //     headerPrefix = 'admin-Bearer';
    // }

    // if (token) {
    //     // Check if the request is NOT FormData (which should have its Content-Type handled by the browser)
    //     // If the request body is NOT a FormData instance, we safely set the JSON header.
    //     // For the Doctor Register flow, request.body is FormData, so we skip setting Content-Type.
    //     if (request.body instanceof FormData) {
    //         authRequest = request.clone({
    //             setHeaders: {
    //                 Authorization: `${headerPrefix} ${token}` // Only attach Authorization
    //             }
    //         });
    //     } else {
    //         // For typical JSON requests
    //         authRequest = request.clone({
    //             setHeaders: {
    //                 'Content-Type': 'application/json', // Safely set JSON header
    //                 Authorization: `${headerPrefix} ${token}`
    //             }
    //         });
    //     }
    // }


    // old code

    if(window.location.pathname.includes('/user') && userToken) {
      authRequest = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          Authorization: `user-Bearer ${userToken}`
        }
      });
    } else if (window.location.pathname.includes('/doctor') && doctorToken) {
      authRequest = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          Authorization: `doctor-Bearer ${doctorToken}`
        }
      });
    } else if (window.location.pathname.includes('/admin') && adminToken) {
      console.log('checking admin token interceptor frontend');
      
      authRequest = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          Authorization: `admin-Bearer ${adminToken}`
        }
      });
    }
    return next.handle(authRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403|| error.status === 401) { // added this: error.status === 401
          // Handle 403 Forbidden error

          // Determine which token to remove based on the URL path
          if (window.location.pathname.includes('/user')) {
              localStorage.removeItem('userToken')
          } else if (window.location.pathname.includes('/doctor')) {
            localStorage.removeItem('doctorToken')
          } else if (window.location.pathname.includes('/admin')) {
            localStorage.removeItem('adminToken');
          }

          console.log('403 Forbidden - Redirecting to home page');
          this._messageToaster.showErrorToastr(error.error.message || 'Something went wrong!')
          this._router.navigate(['/home']); // Navigate to the home page or desired route
        }
        if(error.status===500){
          console.log(error);
          
          this._messageToaster.showErrorToastr('Internal Server Error by interceptor. Please try again later.')
        }
        return throwError(error);
      })
    )
    
    // return next.handle(authRequest).pipe(
    //   catchError((error: HttpErrorResponse) => {
    //     if (error.status === 403 || error.status === 401) {
    //       // Try refreshing token
    //       if (window.location.pathname.includes('/user')) {
    //         return this._userService.refreshAccessTokenUser().pipe(
    //           switchMap((response: any) => {
    //             // Save new token
    //             localStorage.setItem('userToken', response.accessToken);
  
    //             // Retry the failed request
    //             const retryReq = request.clone({
    //               setHeaders: {
    //                 Authorization: `user-Bearer ${response.accessToken}`
    //               }
    //             });
    //             return next.handle(retryReq);
    //           }),
    //           catchError(err => {
    //             // Token refresh failed — logout user
    //             localStorage.removeItem('userToken');
    //             this._router.navigate(['/home']);
    //             return throwError(err);
    //           })
    //         );
    //       }else if(window.location.pathname.includes('/doctor')){
    //         return this._userService.refreshAccessTokenUser().pipe(
    //           switchMap((response: any) => {
    //             // Save new token
    //             localStorage.setItem('doctorToken', response.accessToken);
  
    //             // Retry the failed request
    //             const retryReq = request.clone({
    //               setHeaders: {
    //                 Authorization: `doctor-Bearer ${response.accessToken}`
    //               }
    //             });
    //             return next.handle(retryReq);
    //           }),
    //           catchError(err => {
    //             // Token refresh failed — logout user
    //             localStorage.removeItem('doctorToken');
    //             this._router.navigate(['/home']);
    //             return throwError(err);
    //           })
    //         );
    //       }else if(window.location.pathname.includes('/admin')){
    //         return this._userService.refreshAccessTokenUser().pipe(
    //           switchMap((response: any) => {
    //             // Save new token
    //             localStorage.setItem('adminToken', response.accessToken);
  
    //             // Retry the failed request
    //             const retryReq = request.clone({
    //               setHeaders: {
    //                 Authorization: `admin-Bearer ${response.accessToken}`
    //               }
    //             });
    //             return next.handle(retryReq);
    //           }),
    //           catchError(err => {
    //             // Token refresh failed — logout user
    //             localStorage.removeItem('adminToken');
    //             this._router.navigate(['/home']);
    //             return throwError(err);
    //           })
    //         );
    //       }
    //     }
    //     return throwError(error);
    //   })
    // );

  }
}

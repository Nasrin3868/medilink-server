import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private _commonService:CommonService,private _router:Router) {}

  userToken!:string;
  doctorToken!:string;
  adminToken!:string;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes('cloudinary.com')) {
      return next.handle(request);
    }
    const userToken = this._commonService.getTokenFromLocalStorage(); // User token from local storage
    const doctorToken = this._commonService.getDoctorTokenFromLocalStorage(); // Doctor token from local storage
    // const adminToken = this.commonService.getAdminTokenFromLocalStorage(); // Admin token from local storage

    let authRequest = request;
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
    } else if (window.location.pathname.includes('/admin') && this.adminToken) {
      authRequest = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          Authorization: `admin-Bearer ${this.adminToken}`
        }
      });
    }

    return next.handle(authRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          // Handle 403 Forbidden error

          // Determine which token to remove based on the URL path
          if (window.location.pathname.includes('/user')) {
            localStorage.removeItem('userToken')
          } else if (window.location.pathname.includes('/doctor')) {
            localStorage.removeItem('doctorToken')
          } 

          console.log('403 Forbidden - Redirecting to home page');
          this._router.navigate(['/home']); // Navigate to the home page or desired route
        }
        return throwError(error);
      })
    );
  }
}

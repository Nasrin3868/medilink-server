import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

//check user loggedIn or not
export const doctorLoggedInGuard: CanActivateFn = (route, state) => {
  
  const doctorAuth = inject(AuthService)
  const router=inject(Router)

  if(doctorAuth.checkDoctorLoggedIn()){
    return true
  }else{
    router.navigate(['/home'])
    return false
  }

};

//check user LoggedOut or not
export const doctorLoggedOutGuard:CanActivateFn=(route,state)=>{

  const doctorAuth=inject(AuthService)
  const router=inject(Router)

  if(doctorAuth.checkDoctorLoggedIn()){
    router.navigate(['/home'])
    return false
  }else{
    return true
  }
}
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
    
    const router = new Router();

    const userToken = localStorage.getItem('userToken');
    const doctorToken = localStorage.getItem('doctorToken');
  
    if (userToken) {
      router.navigate(['/user/userHome']);
      return false;
    }
    if (doctorToken) {
      router.navigate(['/doctor/doctorHome']);
      return false;
    }
    //allow access if there is no token 
    return true;
};

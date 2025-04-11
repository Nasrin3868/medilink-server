import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

//check user loggedIn or not
export const userLoggedInGuard: CanActivateFn = (route, state) => {
  
  const userAuth = inject(AuthService)
  const router=inject(Router)
  console.log('user loggedIn guard,usertoken check:',userAuth.checkDoctorLoggedIn());
  
  if(userAuth.checkUserLoggedIn()){
    return true
  }else{
    router.navigate(['/home'])
    localStorage.removeItem('userToken')
    return false
  }

};

//check user LoggedOut or not
export const userLoggedOutGuard:CanActivateFn=(route,state)=>{

  const userAuth=inject(AuthService)
  const router=inject(Router)

  if(userAuth.checkUserLoggedIn()){
    localStorage.removeItem('userToken')
    router.navigate(['/home'])
    return false
  }else{
    return true
  }
}
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
export const adminGuardGuard: CanActivateFn = (route, state) => {
  // const router=new Router()
  const router = inject(Router);
  const adminToken=localStorage.getItem('adminToken')

  if(!adminToken){
    router.navigate(['/login'])
    return false
  }
  return true;
};

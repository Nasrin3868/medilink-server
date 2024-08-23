import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-side-bar',
  templateUrl: './user-side-bar.component.html',
  styleUrls: ['./user-side-bar.component.css']
})
export class UserSideBarComponent {
  
  constructor(
    private _router:Router
  ){}

  logout(){
    localStorage.removeItem('userToken')
    this._router.navigate(['/home'])
    localStorage.removeItem('auth')
  }
}

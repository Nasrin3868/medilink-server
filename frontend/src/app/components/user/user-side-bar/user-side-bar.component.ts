import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserserviceService } from 'src/app/services/userservice.service';

@Component({
  selector: 'app-user-side-bar',
  templateUrl: './user-side-bar.component.html',
  styleUrls: ['./user-side-bar.component.css']
})
export class UserSideBarComponent {
  // New property to control the mobile sidebar state
  isSidebarOpen: boolean = false;

  constructor(
    private _router:Router,
    private _userService:UserserviceService
  ){}

  // New method to toggle the sidebar
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout(){
    localStorage.removeItem('userToken')
    // this._userService.logOut()
    this._router.navigate(['/home'])
    localStorage.removeItem('auth')
  }
}

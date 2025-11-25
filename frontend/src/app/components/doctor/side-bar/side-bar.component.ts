import { Component } from '@angular/core';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent {
  // New property to control the mobile sidebar state
  isSidebarOpen: boolean = false;

  constructor(
    private _router:Router
  ){}
  
  // New method to toggle the sidebar
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout(){
    localStorage.removeItem('doctorToken')
    this._router.navigate(['/home'])
    localStorage.removeItem('auth')
  }
}

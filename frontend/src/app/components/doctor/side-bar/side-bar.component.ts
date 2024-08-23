import { Component } from '@angular/core';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent {

  constructor(
    private _router:Router
  ){}

  logout(){
    localStorage.removeItem('doctorToken')
    this._router.navigate(['/home'])
    localStorage.removeItem('auth')
  }
}

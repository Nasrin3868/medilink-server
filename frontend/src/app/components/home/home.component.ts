import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(
    private _router:Router
  ){}
  onclick(){
    localStorage.setItem('auth','user')
    this._router.navigate(['/user/login'])
  }

  consultButton(){
    localStorage.setItem('auth','user')
    this._router.navigate(['/user/login'])
  }
}

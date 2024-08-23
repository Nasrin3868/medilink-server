import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-home',
  templateUrl: './doctor-home.component.html',
  styleUrls: ['./doctor-home.component.css']
})
export class DoctorHomeComponent {

  constructor(
    private _router:Router
  ){}

  goToProfile(){
    this._router.navigate(['/doctor/doctor_profile'])
  }
}

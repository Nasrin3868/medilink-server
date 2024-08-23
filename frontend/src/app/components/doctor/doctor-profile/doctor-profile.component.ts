import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-profile',
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css']
})
export class DoctorProfileComponent implements OnInit{

  constructor(private _router:Router){}

  ngOnInit(): void {
      this._router.navigate(['/doctor/doctor_profile/doctorDashboard'])
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-success-payment',
  templateUrl: './success-payment.component.html',
  styleUrls: ['./success-payment.component.css']
})
export class SuccessPaymentComponent implements OnInit{

  doctorId!:any

  constructor(
    private _router:Router,
    private _route:ActivatedRoute
  ){}

  ngOnInit(): void {
    this.doctorId = this._route.snapshot.paramMap.get('id');
  }

  toDoctorProfile(){
    this._router.navigate(['/user/doctor_profile',this.doctorId])
  }

  toHome(){
    this._router.navigate(['/user/userHome'])
  }
}

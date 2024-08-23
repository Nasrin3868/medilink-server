import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit{
  greeting=''
  constructor(private _router:Router){}

  ngOnInit(): void {
    const time = new Date().getHours();
      if (time < 10) {
        this.greeting = "Good morning";
      } else if (time < 20) {
        this.greeting = "Good day";
      } else {
        this.greeting = "Good evening";
      } 
  }
  consultButton(){
    this._router.navigate(['/user/doctor_listing'])
  }

}

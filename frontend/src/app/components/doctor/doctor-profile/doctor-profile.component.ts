import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { doctor } from 'src/app/store/model/doctormodel';
import { SideBarComponent } from '../side-bar/side-bar.component';

@Component({
  selector: 'app-doctor-profile',
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css']
})
export class DoctorProfileComponent implements OnInit{
  @ViewChild('sidebarComponent') sidebarComponent!: SideBarComponent; 

  constructor(private _router:Router){}
  // Property to track mobile sidebar state for the backdrop
    get isSidebarOpen(): boolean {
        return this.sidebarComponent ? this.sidebarComponent.isSidebarOpen : false;
    }
  ngOnInit(): void {
      this._router.navigate(['/doctor/doctor_profile/doctorDashboard'])
  }
  // Method to toggle the mobile sidebar state in the child component
    toggleMobileSidebar() {
        if (this.sidebarComponent) {
            this.sidebarComponent.toggleSidebar();
        }
    }
}

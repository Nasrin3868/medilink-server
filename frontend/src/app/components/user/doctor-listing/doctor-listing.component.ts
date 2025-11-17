import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { doctorData, specialization } from 'src/app/admin/model/docotrModel';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { UserserviceService } from 'src/app/services/userservice.service';
// import { doctor } from 'src/app/store/Model/doctormodel';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-doctor-listing',
  templateUrl: './doctor-listing.component.html',
  styleUrls: ['./doctor-listing.component.css']
})

export class DoctorListingComponent implements OnInit{

  specializations:specialization[]=[]
  doctors:doctorData[]=[]
  displayed_doctor:doctorData[]=[]
  // NEW: State for controlling the mobile specialization filter modal
  isFilterOpen: boolean = false;
  
  constructor(
    private _userService:UserserviceService,
    private _messageService:MessageToasterService,
    private _router:Router,
    private _formBuilder:FormBuilder,
  ){}

  ngOnInit(): void {
    this.getSpecializations()
    this.getDocotrDetails()
    this.setupSearchSubscription();
  }
  searchForm=this._formBuilder.group({
    searchData:['',Validators.required]
  })

  setupSearchSubscription() {
    this.searchForm.get('searchData')?.valueChanges
      .pipe(debounceTime(300)) // Adjust debounce time as needed
      .subscribe(value => {
          this.filterDoctors(value);
          // this.searchForm.get('searchData')?.reset(
          //   '', { emitEvent: false } // Prevent another valueChanges trigger
          // );
      });
  }

  filterDoctors(searchTerm: string|null) {
    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      this.displayed_doctor = this.displayed_doctor.filter(doctor =>
        regex.test(doctor.firstName) ||
        regex.test(doctor.lastName)||
        regex.test(doctor.specialization)
      );
    } else {
      this.displayed_doctor = this.doctors;
    }
  }

  getSpecializations(){
    this._userService.getSpecialization().subscribe({
      next:(Response)=>{
        this.specializations=Response
        console.log('specialization',Response);
        
      },error:(error)=>{
        this._messageService.showErrorToastr(error.error.message)
      }
    })
  }

  getDocotrDetails(){
    this._userService.getDoctors().subscribe({
      next:(Response)=>{
        this.doctors=Response
        this.displayed_doctor=this.doctors
        this.displayed_doctor.forEach(data=>{
          // console.log(data);
          // console.log('profile pic',data.profile_picture);
        })
      },error:(error)=>{
        this._messageService.showErrorToastr(error.error.message)
      }
    })
  }
  // 🔑 NEW: Method to toggle the mobile filter modal state
  toggleFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  specializedDoctors(data:string){
    console.log('done:',data);
    
    if(data==='all'){
      this.displayed_doctor=this.doctors
    }else{
      this.displayed_doctor=this.doctors.filter(doc=>{
        return doc.specialization===data
      })
    }
  }
  

  doctorProfile(data:string|undefined){
    this._router.navigate(['/user/doctor_profile',data])
  }

}

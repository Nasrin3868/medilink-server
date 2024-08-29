import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { DoctorService } from 'src/app/services/doctor.service';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { UserserviceService } from 'src/app/services/userservice.service';

@Component({
  selector: 'app-user-booking',
  templateUrl: './user-booking.component.html',
  styleUrls: ['./user-booking.component.css']
})
export class UserBookingComponent implements OnInit{
  payments!:any
  payments_to_display!:any
  userId!:string|null
  
  constructor(
    private _messageService:MessageToasterService,
    private _formBuilder:FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _doctorService:DoctorService,
    private _userService:UserserviceService
  ){}

  ngOnInit(): void {
    this.getAppointmentDetails()
    // this.consultationForm.get('status')?.valueChanges.subscribe(value => {
    //   if(value) this.consultationFormSubmit()
    // });
    this.userId=localStorage.getItem('userId')
    this.setupSearchSubscription()
  }

  getAppointmentDetails(){
    this._userService.get_bookings_of_user({userId:localStorage.getItem('userId')}).subscribe({

    })
    this._doctorService.get_bookings_of_doctor({doctorId:localStorage.getItem('doctorId')}).subscribe({
      next:(Response)=>{
        this.payments=Response
        this.payments_to_display=this.payments
      },
      error:(error)=>{
        this._messageService.showErrorToastr(error.error.message)
      }
    })
  }

  searchForm=this._formBuilder.group({
    searchData:['',Validators.required]
  })

  setupSearchSubscription() {
    this.searchForm.get('searchData')?.valueChanges
      .pipe(debounceTime(300)) // Adjust debounce time as needed
      .subscribe(value => {
          this.filterDoctors(value);
      });
  }

  filterDoctors(searchTerm: string|null) {
    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      this.payments_to_display = this.payments_to_display.filter((appointment:any) =>
        regex.test(appointment.userId.firstName)||
        regex.test(appointment.userId.lastName)||
        regex.test(appointment.consultation_status)
      );
    } else {
      this.payments_to_display = this.payments;
    }
  }

  // consultationForm=this._formBuilder.group({
  //   status:['all']
  // })

  // consultationFormSubmit(){
  //   if(this.consultationForm.valid){
  //     const selectedStatus=this.consultationForm.value.status
  //     if(selectedStatus==='all'){
  //       this.payments_to_display=this.payments
  //     }else if(selectedStatus==='pending'){
  //       this.payments_to_display = this.payments.filter((item: any) => 
  //           item.consultation_status==='pending'
  //       );
  //     }else if(selectedStatus==='consulted'){
  //       this.payments_to_display = this.payments.filter((item: any) => 
  //         item.consultation_status==='consulted'
  //       );
  //     }else if(selectedStatus==='not_consulted'){
  //       this.payments_to_display = this.payments.filter((item: any) => 
  //         item.consultation_status==='not_consulted'
  //       );
  //     }else if(selectedStatus==='cancelled'){
  //       this.payments_to_display = this.payments.filter((item: any) => 
  //         item.consultation_status==='cancelled'
  //       );
  //     }
  //     this._cdr.detectChanges();
  //   }
  // }
}

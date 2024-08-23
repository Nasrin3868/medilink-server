import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { AdminServiceService } from '../../services/admin-service.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpResponseBase } from '@angular/common/http';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-appointment-history',
  templateUrl: './appointment-history.component.html',
  styleUrls: ['./appointment-history.component.css']
})
export class AppointmentHistoryComponent implements OnInit{

  appointments!:any
  appointments_to_display!:any
  constructor(
    private _adminService:AdminServiceService,
    private _messageService:MessageToasterService,
    private _formBuilder:FormBuilder,
    private _cdr: ChangeDetectorRef
  ){}

  ngOnInit(){
    this.getAppointmentDetails()
    this.consultationForm.get('status')?.valueChanges.subscribe(value => {
      console.log('Status changed to:', value);
      if(value) this.consultationFormSubmit()
    });
  this.setupSearchSubscription()
  }

  getAppointmentDetails(){
    this._adminService.getAppointment().subscribe({
      next:(Response)=>{
        this.appointments=Response
        this.appointments_to_display=this.appointments
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
      this.appointments_to_display = this.appointments_to_display.filter((appointment:any) =>
        regex.test(appointment.userId.firstName) ||
        regex.test(appointment.userId.lastName)||
        regex.test(appointment.doctorId.firstName)||
        regex.test(appointment.doctorId.lastName)||
        regex.test(appointment.consultation_status)
      );
    } else {
      this.appointments_to_display = this.appointments;
    }
  }

  consultationForm=this._formBuilder.group({
    status:['all']
  })

  consultationFormSubmit(){
    console.log('consultation form submit');
    
    if(this.consultationForm.valid){
      const selectedStatus=this.consultationForm.value.status
      console.log('status:',selectedStatus);
      if(selectedStatus==='all'){
        this.appointments_to_display=this.appointments
      }else if(selectedStatus==='pending'){
            this.appointments_to_display = this.appointments.filter((item: { consultation_status: string; }) => 
                item.consultation_status==='pending'
            );
            console.log('appointments_to_display:',this.appointments_to_display)
      }else if(selectedStatus==='consulted'){
        this.appointments_to_display = this.appointments.filter((item: { consultation_status: string; }) => 
          item.consultation_status==='consulted'
        );
            console.log('appointments_to_display:',this.appointments_to_display)
      }else if(selectedStatus==='not_consulted'){
        this.appointments_to_display = this.appointments.filter((item: { consultation_status: string; }) => 
          item.consultation_status==='not_consulted'
        );
        console.log('appointments_to_display:',this.appointments_to_display)
      }else if(selectedStatus==='cancelled'){
        this.appointments_to_display = this.appointments.filter((item: { consultation_status: string; }) => 
          item.consultation_status==='cancelled'
        );
        console.log('appointments_to_display:',this.appointments_to_display)
      }
      this._cdr.detectChanges();
    }
  }

}

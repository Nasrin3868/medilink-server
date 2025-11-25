import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from 'src/app/services/doctor.service';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { roomIdPattern } from '../../shared/regular_expressions/regular_expressions';

@Component({
  selector: 'app-next-appointment',
  templateUrl: './next-appointment.component.html',
  styleUrls: ['./next-appointment.component.css']
})
export class NextAppointmentComponent implements OnInit{

  disable:boolean=false
  roomId:string|null|undefined=''
  upcomingAppointment!:any

  // NEW: State variable for loading
  isLoading: boolean = true;

  constructor(
    private _router:Router,
    private _messageService:MessageToasterService,
    private _doctorService:DoctorService,
    private _formBuilder:FormBuilder
  ){}

  ngOnInit(): void {
    this.isLoading = true; // Start loading
    const doctorId=localStorage.getItem('doctorId')
    if(doctorId)
    this._doctorService.upcomingAppointment({doctorId:doctorId}).subscribe({
      next:(Response)=>{
        if(Object.entries(Response).length === 0){
          this.upcomingAppointment=0
        }else{
          this.upcomingAppointment=Response
          this.checkAppointmentTime()
        }
        console.log(Response)
        this.isLoading = false; // Stop loading
      },error:(error)=>{
        this._messageService.showErrorToastr(error.error.message)
        this.isLoading = false; // Stop loading
      }
    })
  }
  checkAppointmentTime() {
    if (this.upcomingAppointment && this.upcomingAppointment.slotId.time) { // Use slotId.time (actual time) instead of dateOfBooking
      const appointmentDate = new Date(this.upcomingAppointment.slotId.time).getTime();
      const prepTime = 5 * 60 * 1000; // 5 minutes before the appointment
      
      const windowStart = appointmentDate - prepTime;
      const windowEnd = appointmentDate + 30 * 60 * 1000; 
      const currentDate = new Date().getTime();
      
      // Enable the input only if the current time is within the window
      if (currentDate >= windowStart && currentDate <= windowEnd) {
        this.roomIdForm.get('roomId')?.enable()
        this.disable = false;
      } else {
        this.disable = true;
        this.roomIdForm.get('roomId')?.disable()
      }
    }
    // if (this.upcomingAppointment && this.upcomingAppointment.dateOfBooking) {
    //   const appointmentDate = new Date(this.upcomingAppointment.dateOfBooking).getTime();
    //   const windowStart = appointmentDate;
    //   const windowEnd = appointmentDate + 30 * 60 * 1000; // 30 minutes in milliseconds
    //   const currentDate = new Date().getTime();
    //   // Enable the input only if the current time is within the 30-minute window
    //   if (currentDate >= windowStart && currentDate <= windowEnd) {
    //     this.roomIdForm.get('roomId')?.enable()
    //     this.disable = false;
    //   } else {
    //     this.disable = true;
    //     this.roomIdForm.get('roomId')?.disable()
    //   }
    // }
  }

  roomIdForm=this._formBuilder.group({
    roomId:['',[Validators.required,Validators.pattern(roomIdPattern)]]
  })

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  roomIdFormSubmit(){
    if(this.roomIdForm.invalid){
      this.markFormGroupTouched(this.roomIdForm);
      return
    }else{
      this.roomId = this.roomIdForm.value.roomId;
      // console.log('Room ID:', this.roomId);
      this.enterRoom();
    }
    
  }

  enterRoom(){
    this._doctorService.shareRoomIdThroughEmail({roomId:this.roomId,slotId:this.upcomingAppointment._id}).subscribe({
      next:(Response)=>{
        this._messageService.showSuccessToastr(Response.message)
      },error:(error)=>{
        this._messageService.showErrorToastr(error.error.message)
      }
    })
    if(this.roomId){
      this._router.navigate(['/doctor/doctor_video_call_room',this.roomId,this.upcomingAppointment._id])
    }else{
      this._messageService.showErrorToastr('enter the roomId')
    }
  }

  generateRoomId() {
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substr(2, 8);
    this.roomId = `${timestamp}-${randomString}`;
  }
}

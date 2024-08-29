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
  upcoming_appointment!:any

  constructor(
    private _router:Router,
    private _messageService:MessageToasterService,
    private _doctorService:DoctorService,
    private _formBuilder:FormBuilder
  ){}

  ngOnInit(): void {
      const doctorId=localStorage.getItem('doctorId')
      if(doctorId)
      this._doctorService.upcomingAppointment({doctorId:doctorId}).subscribe({
        next:(Response)=>{
          if(Object.entries(Response).length === 0){
            this.upcoming_appointment=0
          }else{
            this.upcoming_appointment=Response
            this.checkAppointmentTime()
          }
          console.log(Response)
        },error:(error)=>{
          this._messageService.showErrorToastr(error.error.message)
        }
      })
  }
  checkAppointmentTime() {
    if (this.upcoming_appointment && this.upcoming_appointment.dateOfBooking) {
      const appointmentDate = new Date(this.upcoming_appointment.dateOfBooking).getTime();
      const windowStart = appointmentDate;
      const windowEnd = appointmentDate + 30 * 60 * 1000; // 30 minutes in milliseconds
      const currentDate = new Date().getTime();
      // Enable the input only if the current time is within the 30-minute window
      if (currentDate >= windowStart && currentDate <= windowEnd) {
        this.roomIdForm.get('roomId')?.enable()
        this.disable = false;
      } else {
        this.disable = true;
        this.roomIdForm.get('roomId')?.disable()
      }
    }
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
    this._doctorService.share_roomId_through_email({roomId:this.roomId,slotId:this.upcoming_appointment._id}).subscribe({
      next:(Response)=>{
        this._messageService.showSuccessToastr(Response.message)
      },error:(error)=>{
        this._messageService.showErrorToastr(error.error.message)
      }
    })
    if(this.roomId){
      this._router.navigate(['/doctor/doctor_video_call_room',this.roomId,this.upcoming_appointment._id])
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

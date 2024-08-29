import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { UserserviceService } from 'src/app/services/userservice.service';

@Component({
  selector: 'app-user-next-appointment',
  templateUrl: './user-next-appointment.component.html',
  styleUrls: ['./user-next-appointment.component.css']
})
export class UserNextAppointmentComponent implements OnInit{

  roomId!:any
  slotDetails!:any
  link!:any
  disable=false
  noAppointmnet=false
  constructor(
    private _userService:UserserviceService,
    private _router:Router,
    private _messageService:MessageToasterService,
  ){}

  ngOnInit(): void {
    const userId=localStorage.getItem('userId')
    if(userId)
      this._userService.upcoming_appointment({_id:userId}).subscribe({
        next:(Response)=>{
          console.log('response:',Response);
          
          if(Object.entries(Response).length === 0){
            this.slotDetails=0
          }else{
            this.slotDetails=Response
            this.checkAppointmentTime()
          }
        },error:(error)=>{
          this._messageService.showErrorToastr(error.error.message)
        }
      })
  }


  //change this with iso date formta and check, change dateofbooking to time
  checkAppointmentTime() {
    if (this.slotDetails && this.slotDetails.dateOfBooking) {
      const appointmentDate = new Date(this.slotDetails.dateOfBooking).getTime();
      const windowStart = appointmentDate;
      const windowEnd = appointmentDate + 30 * 60 * 1000; // 30 minutes in milliseconds
      const currentDate = new Date().getTime();
  
      // Enable the input only if the current time is within the 30-minute window
      if (currentDate >= windowStart && currentDate <= windowEnd) {
        this.disable = false;
      } else {
        this.disable = true;
      }
    }
  }

  enterRoom(){
    this._userService.getUpcomingSlot({appointmentId:this.slotDetails._id,roomId:this.roomId}).subscribe({
      next:(Response)=>{
        if(Response.roomId===this.roomId){
          this._router.navigate(['/user/user_video_call_room',this.roomId,this.slotDetails._id])
        }else{
          this._messageService.showErrorToastr('InCorrect roomId. Check once more')
        }
      },error:(error)=>{
        this._messageService.showErrorToastr(error.error.message)
      }
    })
    // if(this.roomId){
    //   this._router.navigate(['/user/user_video_call_room',this.roomId,this.slotDetails._id])
    // }else{
    //   this._messageService.showErrorToastr('enter the roomId')
    // }
  }

  doctor_listing(){
    this._router.navigate(['/user/doctor_listing'])
  }
}

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

  roomId!:string
  slotDetails:any=''
  link!:string
  disable=false
  noAppointmnet=false
  // NEW: State variable for loading
  isLoading: boolean = true;
  constructor(
    private _userService:UserserviceService,
    private _router:Router,
    private _messageService:MessageToasterService,
  ){}

  ngOnInit(): void {
    const userId=localStorage.getItem('userId')
    if(userId){
      // loading to true before API call
      this.isLoading = true;
      this._userService.upcomingAppointment({_id:userId}).subscribe({
        next:(Response)=>{
          console.log('response:',Response);
          
          if(Object.entries(Response).length === 0){
            this.slotDetails=0
          }else{
            this.slotDetails=Response
            this.checkAppointmentTime()
          }
          // SET loading to false after successful response
          this.isLoading = false;
        },error:(error)=>{
          this._messageService.showErrorToastr(error.error.message)
          // SET loading to false on error
          this.isLoading = false; 
        }
        
      })
    }else {
        // If no userId, stop loading and show no appointment
        this.isLoading = false;
        this.slotDetails = 0;
    }
  }


  //change this with iso date formta and check, change dateofbooking to time
  checkAppointmentTime() {
    // Assuming slotDetails.slotId.time holds the ISO time string for the appointment
    if (this.slotDetails && this.slotDetails.slotId && this.slotDetails.slotId.time) {
      // Use the slot time for accurate check, not dateOfBooking (which is likely the booking creation date)
      const appointmentDate = new Date(this.slotDetails.slotId.time).getTime();
      const prepTime = 5 * 60 * 1000; // 5 minutes before the appointment
      
      // The entry window starts 5 minutes before the appointment time
      const windowStart = appointmentDate - prepTime; 
      // Assuming the window closes 30 minutes after the start time for the doctor to join
      const windowEnd = appointmentDate + 30 * 60 * 1000; 
      
      const currentDate = new Date().getTime();
  
      // Enable the input only if the current time is within the window
      if (currentDate >= windowStart && currentDate <= windowEnd) {
        this.disable = false;
      } else {
        this.disable = true;
      }
    } else {
      // Safely disable if data is missing or unexpected
      this.disable = true;
    }
  }

  enterRoom(){
    // console.log(this.slotDetails._id,this.roomId);
    if(!this.slotDetails._id&&!this.roomId){
      console.log('no slotDetails');
      
      this._messageService.showErrorToastr('Enter roomId')
    }else{
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
    }
    
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

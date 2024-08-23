import { Component, OnInit } from '@angular/core';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { UserserviceService } from 'src/app/services/userservice.service';

@Component({
  selector: 'app-user-prescription-history',
  templateUrl: './user-prescription-history.component.html',
  styleUrls: ['./user-prescription-history.component.css']
})
export class UserPrescriptionHistoryComponent implements OnInit{

  prescription!:any
  prescription_to_display!:any
  constructor(
    private _messageService:MessageToasterService,
    private _userService:UserserviceService
  ){}

  ngOnInit(): void {
      this._userService.prescription_history({userId:localStorage.getItem('userId')}).subscribe({
        next:(response)=>{
          this.prescription=response
          this.prescription_to_display=this.prescription
        },error:(error)=>{
          this._messageService.showErrorToastr(error.error.message)
        }
      })
  }

  showDetails(prescription: any) {

  }
}

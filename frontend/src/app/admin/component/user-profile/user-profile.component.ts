import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminServiceService } from '../../services/admin-service.service';
import { userdata } from '../../model/usermodel';
import { MessageToasterService } from 'src/app/services/message-toaster.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit{

  userId!:string;
  userdata!:userdata;
  constructor(
    private _route:ActivatedRoute,
    private _adminService:AdminServiceService,
    private _messageService:MessageToasterService,
  ){}

  ngOnInit(){
    this.userId = this._route.snapshot.paramMap.get('id')!;
    this.userDetails()
  }

  userDetails(){
    const data={_id:this.userId}
    this._adminService.userDetails(data).subscribe({
      next:(Response)=>{
        this.userdata=Response
      },
      error:(error)=>{
        this._messageService.showErrorToastr(error.error.message)
      }
    })
  }
}

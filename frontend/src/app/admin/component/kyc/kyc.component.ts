import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from '../../services/admin-service.service';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { kyc_verification } from '../../model/docotrModel';

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.css']
})
export class KycComponent implements OnInit{
kycdatas!:kyc_verification[]

  constructor(
    private _adminService:AdminServiceService,
    private _messageService:MessageToasterService
  ){}
  ngOnInit(){
    this.kycData()
  }

  kycData(){
    this._adminService.kycdata().subscribe({
      next:(Response)=>{
        this.kycdatas=Response
      },
      error:(error)=>{
        this._messageService.showErrorToastr(error.error.message)
      }
    })
  }

}

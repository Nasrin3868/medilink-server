import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AdminServiceService } from '../../services/admin-service.service';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { payOutPattern } from 'src/app/components/shared/regular_expressions/regular_expressions';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.css']
})
export class CommissionComponent implements OnInit{
  payOut:string|null|undefined='100'
  edit=false

  constructor(
    private _formBuilder:FormBuilder,
    private _adminService:AdminServiceService,
    private _messageService:MessageToasterService,
  ){}

  ngOnInit(): void {
      this.payOut=localStorage.getItem('admindetails')
  }

  payOutForm=this._formBuilder.group({
    payOut:[this.payOut,[Validators.required,Validators.pattern(payOutPattern)]]
  })

  Submit(){
    this.edit=!this.edit
    this.payOut=this.payOutForm.value.payOut
    this._adminService.editpayOut({payOut:this.payOut}).subscribe({
      next:(Response)=>{
        this._messageService.showSuccessToastr(Response.message)
      },
      error:(error)=>{
        this._messageService.showErrorToastr(error.message.message)
      }
    })
  }
}

import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from '../../services/admin-service.service';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { FormBuilder, Validators } from '@angular/forms';
import { specialization } from '../../model/docotrModel';

@Component({
  selector: 'app-specialization',
  templateUrl: './specialization.component.html',
  styleUrls: ['./specialization.component.css']
})
export class SpecializationComponent implements OnInit{

  namePattern = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*\s*$/;
  specialization!:specialization[]
  editData!:specialization
  edit=false

  constructor(
    private _adminService:AdminServiceService,
    private _messageService:MessageToasterService,
    private _formBuilder:FormBuilder
  ){}

  ngOnInit(){
    this.getSpecialization()
  }

  specializationForm=this._formBuilder.group({
    specialization:['',[Validators.required,Validators.maxLength(50),Validators.pattern(this.namePattern)]]
  })
  
  editspecializationForm=this._formBuilder.group({
    specialization:['',[Validators.required,Validators.maxLength(50),Validators.pattern(this.namePattern)]]
  })

  getSpecialization(){
    this._adminService.getSpecialization().subscribe({
      next:(Response)=>{
          this.specialization=Response
      },
      error:(error)=>{
        this._messageService.showErrorToastr(error.error.message)
      }
    })
  }
  
  //add spec
  addSubmit(){
    let data=this.specializationForm.value.specialization
    if(this.specializationForm.invalid){
      if(this.specializationError()){
        this._messageService.showErrorToastr(this.specializationError())
      }
    }else{
      let spec=this.specialization.some(spec=>spec.specialization.toLowerCase()===data!.toLowerCase())
      if(spec){
              this.specializationForm.reset()
              this._messageService.showWarningToastr(`${data} already exists!`)
      }else{
        if(data){
          const Data={specialization:data}
          this._adminService.addSpecialization(Data).subscribe({
            next:(Response)=>{
              this._messageService.showSuccessToastr(Response.message)
              this.getSpecialization()
              this.specializationForm.reset()
            },
            error:(error)=>{
              this._messageService.showErrorToastr(error.error.message)
              this.specializationForm.reset()
            }
          })
        }
      }
    }
  }
  
  //edit call of a spec
  editSpec(data:specialization){
    this.editData=data
    this.edit=true
    this.editspecializationForm.setValue({specialization:data.specialization})
  }

  //closeEdit
  closeEdit(){
    this.edit=!this.edit
  }

  //edit spec
  editSubmit(){
    let data=this.editData
    if(this.editspecializationForm.invalid){
      if(this.editspecializationError()){
        this._messageService.showErrorToastr(this.editspecializationError())
      }
    }else{
      if(data){
        const spec=this.editspecializationForm.value.specialization
        if(spec) data.specialization=spec
        this._adminService.editSpecialization(data).subscribe({
          next:(Response)=>{
            this._messageService.showSuccessToastr(Response.message)
          },
          error:(error)=>{
            this._messageService.showErrorToastr(error.error.message)
          }
        })
      }
    }
    this.edit=!this.edit
  }

  //delete spec
  deleteSpec(data:any){
    const value={_id:data._id,specialization:data.specialization}
    this._adminService.deleteSpecialization(data).subscribe({
      next:(Response)=>{
        this._messageService.showSuccessToastr(Response.message)
        this.specialization=this.specialization.filter(data=>data._id!=value._id)
      },
      error:(error)=>{
        this._messageService.showErrorToastr(error.error.message)
      }
    })
  }

  //add spec error
  specializationError():string{
    const name = this.specializationForm.get('specialization');
    if (name?.invalid) {
      if (name?.errors?.['required']) {
        return `Specialization is required`;
      } else if (name.errors?.['maxlength']) {
        return `Specialization length upto max 50 letters`;
      } else if (name.errors?.['pattern']) {
        return `Specialization is invalid`;
      }
    }
    return ``;
  }

  //edit specialization error
  editspecializationError():string{
    const name = this.editspecializationForm.get('specialization');
    if (name?.invalid) {
      if (name?.errors?.['required']) {
        return `Specialization is required`;
      } else if (name.errors?.['maxlength']) {
        return `Specialization length upto max 50 letters`;
      } else if (name.errors?.['pattern']) {
        return `Specialization is invalid`;
      }
    }
    return ``;
  }

}

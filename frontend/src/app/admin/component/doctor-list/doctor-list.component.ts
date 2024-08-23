import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from '../../services/admin-service.service';
import { doctorData } from '../../model/docotrModel';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { Data, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.css']
})
export class DoctorListComponent implements OnInit {
  doctors!:doctorData[]
  doctors_to_display!:doctorData[]
  constructor(
    private _adminService:AdminServiceService,
    private _messageservice:MessageToasterService,
    private _router:Router,
    private _formBuilder:FormBuilder
  ){}

  ngOnInit(){

    this.getAllDOctors()
    this.verificationForm.get('status')?.valueChanges.subscribe(value => {
      console.log('Status changed to:', value);
      if(value) this.verificationFormSubmit()
    });
  }

  verificationForm=this._formBuilder.group({
    status:['all']
  })

  verificationFormSubmit(){
    console.log('verification form submit');
    
    if(this.verificationForm.valid){
      const selectedStatus=this.verificationForm.value.status
      console.log('status:',selectedStatus);
      if(selectedStatus==='all'){
        this.doctors_to_display=this.doctors
      }else if(selectedStatus==='verified'){
        this.doctors_to_display = this.doctors.filter((item: any) => 
            item.kyc_verification==="true"
        );
      }else if(selectedStatus==='not_verified'){
        this.doctors_to_display = this.doctors.filter((item: any) => 
          item.kyc_verification==="false"
        );
      }else if(selectedStatus==='blocked'){
        this.doctors_to_display = this.doctors.filter((item: any) => 
          item.blocked==="true"
        );
      }else if(selectedStatus==='unblocked'){
        this.doctors_to_display = this.doctors.filter((item: any) => 
          item.blocked==="false"
        );
      }
      // this.cdr.detectChanges();
    }
  }


  kyc_verification(data:any){
    const _id=data
    console.log('_id for doctor kyc from docotr listing component:',_id);
    localStorage.setItem('doctor_id_for_kyc_details',_id)
    this._router.navigate(['/admin_home/checkDocumentsKYC']);
  }

  getAllDOctors(){
    const queryparams={doctor:'all'}
    this._adminService.getDoctors(queryparams).subscribe({
      next:(Response)=>{
        console.log('get doctor details',Response)
        this.doctors=Response
        this.doctors_to_display=this.doctors
      },
      error:(error)=>{
        console.log('got error');
        this._messageservice.showErrorToastr(error.message)
      }
    })
  }

  changeStatus(data:any){
    const datas={_id:data._id}
    console.log('queryparams:',datas)
    this._adminService.doctorBlock(datas).subscribe({
      next:(Response)=>{
        console.log('status changes')
        // data.blocked=!data.blocked
        data.blocked==='true'?data.blocked='false':data.blocked='true'
      },
      error:(error)=>{
        console.log('got error',error);
        this._messageservice.showErrorToastr(error.message)
      }
    })
  }

}

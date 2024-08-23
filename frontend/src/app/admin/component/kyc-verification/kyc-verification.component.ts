import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminServiceService } from '../../services/admin-service.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { doctorData } from '../../model/docotrModel';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-kyc-verification',
  templateUrl: './kyc-verification.component.html',
  styleUrls: ['./kyc-verification.component.css']
})
export class KycVerificationComponent implements OnInit{

  doctor_kyc_details!:any
  doctor_id!:any
  constructor(
    private _router:Router,
    private _adminService:AdminServiceService,
    private _messagService:MessageToasterService,
    private _formBuilder:FormBuilder,
  ){}

  ngOnInit(): void {
      this.doctor_id=localStorage.getItem('doctor_id_for_kyc_details')
      this.get_doctor_kyc_details_from_id(this.doctor_id)
  }

  get_doctor_kyc_details_from_id(_id:any){
    this._adminService.get_doctor_kyc_details_from_id({docId:_id}).subscribe({
      next:(Response)=>{
        console.log('doc details:',Response);
        this.doctor_kyc_details=Response
        console.log(this.doctor_kyc_details.curr_work_hosp);
        this.initialize_form();
      },
      error:(error)=>{
        this._messagService.showErrorToastr(error.error.message)
      }
    })
  }

  kyc_verification_form=this._formBuilder.group({
    id_proof_type:['',Validators.required],
    id_proof:['',Validators.required],
    doctor_liscense:['',Validators.required],
    qualification_certificate:['',Validators.required],
    experience_certificate:['',Validators.required],
    specialization:['',Validators.required],
    currently_working_hospital:['',Validators.required],
  })

  initialize_form(){
    this.kyc_verification_form.setValue({
      id_proof_type: this.doctor_kyc_details.id_proof_type,
      id_proof: this.doctor_kyc_details.id_proof,
      doctor_liscense: this.doctor_kyc_details.doc_liscence,
      qualification_certificate: this.doctor_kyc_details.qualification_certificate,
      experience_certificate: this.doctor_kyc_details.exp_certificate,
      specialization: this.doctor_kyc_details.specialization,
      currently_working_hospital: this.doctor_kyc_details.curr_work_hosp,
    });
  }
  
  file_download(name: string, index: Number = -1) {
    const pdf_name = name;
    let pdfUrl = this.doctor_kyc_details.docId[pdf_name];
    this._router.navigate(['/admin_home/pdf_viewer'], { queryParams: { url: encodeURIComponent(pdfUrl) } });
  }
  
  
  // file_download(){
  // file_download(name:string,index:Number=-1){
  //   const pdf_name=name
  //   let pdfUrl=this.doctor_kyc_details.docId[pdf_name]
  //   this._router.navigate(['/admin_home/pdf_viewer'], { queryParams: { url: encodeURIComponent(pdfUrl) } });
  //   // console.log('data to download:',name);
  //   // const data={name:name,index:index,docId:this.doctor_kyc_details.docId._id}
  //   // this._adminService.download_kyc_documents(data).subscribe({
  //   //   next:(Response)=>{
  //   //     this._messagService.showSuccessToastr(Response.message)
  //   //   },
  //   //   error:(error)=>{
  //   //     this._messagService.showErrorToastr(error.error.message)
  //   //   }
  //   // })
  // }

  submit_kyc_verification_form(){
    const data={
      _id:this.doctor_kyc_details._id,
      doctor_id:this.doctor_kyc_details.docId._id,
      id_proof_type: this.kyc_verification_form.value.id_proof_type,
      id_proof: this.kyc_verification_form.value.id_proof,
      doc_liscence: this.kyc_verification_form.value.doctor_liscense,
      qualification_certificate: this.kyc_verification_form.value.qualification_certificate,
      exp_certificate: this.kyc_verification_form.value.experience_certificate,
      specialization: this.kyc_verification_form.value.specialization,
      curr_work_hosp: this.kyc_verification_form.value.currently_working_hospital ,
    }

    this._adminService.submit_kyc_details(data).subscribe({
      next:(Response)=>{
        if(Response.message==='KYC verification done'){
          this._messagService.showSuccessToastr(Response.message)
          this._router.navigate(['/admin_home/doctor_listing'])
        }else{
          this._messagService.showWarningToastr(Response.message)
        }
      },
      error:(error)=>{
        this._messagService.showErrorToastr(error.error.message)
      }
    })
  }

  previous_page(){
    this._router.navigate(['/admin_home/doctor_listing'])
  }


}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from 'src/app/services/doctor.service';
import { MessageToasterService } from 'src/app/services/message-toaster.service';

@Component({
  selector: 'app-add-prescription',
  templateUrl: './add-prescription.component.html',
  styleUrls: ['./add-prescription.component.css']
})
export class AddPrescriptionComponent implements OnInit{


  appointmentId!:string|null
  constructor(
    private _messageService:MessageToasterService,
    private _router:Router,
    private _route:ActivatedRoute,
    private _doctorService:DoctorService,
    private _formBuilder:FormBuilder,
  ){}
  ngOnInit(): void {
    this.appointmentId = this._route.snapshot.paramMap.get('appointmentId');
  }

  prescriptionForm=this._formBuilder.group({
    disease:['',Validators.required],
    prescription:['',Validators.required]
  })

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  
  onSubmit(){
    if(this.prescriptionForm.invalid){
      this.markFormGroupTouched(this.prescriptionForm);
      return
    }else{
      const data={
        appointmentId:this.appointmentId,
        disease:this.prescriptionForm.value.disease,
        prescription:this.prescriptionForm.value.prescription,
      }
      this._doctorService.add_prescription(data).subscribe({
        next:(response)=>{
          this._messageService.showSuccessToastr(response.message)
          this._router.navigate(['/doctor/doctor_profile'])
        },error:(error)=>{
          this._messageService.showErrorToastr(error.error.message)
        }
      })
    }
  }

}

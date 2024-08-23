import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { UserserviceService } from 'src/app/services/userservice.service';

@Component({
  selector: 'app-prescription-modal',
  templateUrl: './prescription-modal.component.html',
  styleUrls: ['./prescription-modal.component.css']
})
export class PrescriptionModalComponent implements OnInit,OnChanges{
  @Input() prescription_id: string | null = null;
  modal!: { _id: string; };
  auth!:string
  disease!:string
  prescription_note!:string

  constructor(
    private _commonService:CommonService,
    private _userService:UserserviceService,
    private _doctorService:DoctorService,
    private _messageService:MessageToasterService
  ){}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  // ngOnInit(): void {
  //   console.log('modal component loads');
    
  //   this.auth=this._commonService.getAuthFromLocalStorage()
  //   this.get_prescription()
  // }
  ngOnChanges(changes: SimpleChanges) {
    // Ensure the modal opens only when prescription_id changes
    if (changes['prescription_id'] && this.prescription_id) {
      this.openModal();
    }
  }

  get_prescription(){
    if(this.auth==='user'){
      this._userService.get_prescription_details({_id:this.prescription_id}).subscribe({
        next:(Response)=>{
          this.disease=Response.disease
          this.prescription_note=Response.prescription
        },error:(error)=>{
          this._messageService.showErrorToastr(error.error.message)
        }
      })
    }
  }
  openModal() {
    const modal = document.getElementById('prescription-modal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  closeModal() {
    const modal = document.getElementById('prescription-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }
}

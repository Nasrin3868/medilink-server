import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { DoctorService } from 'src/app/services/doctor.service';
import { MessageToasterService } from 'src/app/services/message-toaster.service';

@Component({
  selector: 'app-doctor-payment-details',
  templateUrl: './doctor-payment-details.component.html',
  styleUrls: ['./doctor-payment-details.component.css']
})
export class DoctorPaymentDetailsComponent implements OnInit{
  payments!:any
  payments_to_display!:any
  doctorId!:any
  
  constructor(
    private _messageService:MessageToasterService,
    private _formBuilder:FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _doctorService:DoctorService,
  ){}

  ngOnInit(): void {
    // console.log('doctor payment details page from routing');
    this.getAppointmentDetails()
    this.paymentForm.get('status')?.valueChanges.subscribe(value => {
      // console.log('Status changed to:', value);
      if(value) this.paymentFormSubmit()
    });
  this.doctorId=localStorage.getItem('doctorId')
  this.setupSearchSubscription()
  }

  getAppointmentDetails(){
    // console.log('getAppointmentDetails func called origina');
    this._doctorService.get_booking_details_of_doctor({doctorId:localStorage.getItem('doctorId')}).subscribe({
      next:(Response)=>{
        this.payments=Response
        this.payments_to_display=this.payments
        // console.log('get payment details:',Response);
      },
      error:(error)=>{
        this._messageService.showErrorToastr(error.error.message)
      }
    })
  }

  searchForm=this._formBuilder.group({
    searchData:['',Validators.required]
  })

  setupSearchSubscription() {
    this.searchForm.get('searchData')?.valueChanges
      .pipe(debounceTime(300)) // Adjust debounce time as needed
      .subscribe(value => {
          this.filterDoctors(value);
      });
  }

  filterDoctors(searchTerm: string|null) {
    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      this.payments_to_display = this.payments_to_display.filter((appointment:any) =>
        regex.test(appointment.doctorId.firstName)||
        regex.test(appointment.slotId.bookingAmount)||
        regex.test(appointment.payment_method)
      );
    } else {
      this.payments_to_display = this.payments;
    }
  }

  paymentForm=this._formBuilder.group({
    status:['all']
  })

  paymentFormSubmit(){
    console.log('payment form submit');
    if(this.paymentForm.valid){
      const selectedStatus=this.paymentForm.value.status
      if(selectedStatus==='all'){
        this.payments_to_display=this.payments
      }else if(selectedStatus==='onlinePayment'){
        this.payments_to_display = this.payments.filter((item: { payment_method: string; }) => 
            item.payment_method==='online_payment'
        );
      }else if(selectedStatus==='walletPayment'){
        this.payments_to_display = this.payments.filter((item: { payment_method: string; }) => 
          item.payment_method==='wallet_payment'
        );
      }
      this._cdr.detectChanges();
    }
  }

}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AdminServiceService } from '../../services/admin-service.service';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { FormBuilder, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})

export class PaymentHistoryComponent implements OnInit{

  payments!:any
  payments_to_display!:any
  
  constructor(
    private _adminService:AdminServiceService,
    private _messageService:MessageToasterService,
    private _formBuilder:FormBuilder,
    private _cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.getAppointmentDetails()
    this.paymentForm.get('status')?.valueChanges.subscribe(value => {
      if(value) this.paymentFormSubmit()
    });
  this.setupSearchSubscription()
  }

  getAppointmentDetails(){
    this._adminService.getAppointment().subscribe({
      next:(Response)=>{
        this.payments=Response
        this.payments_to_display=this.payments
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

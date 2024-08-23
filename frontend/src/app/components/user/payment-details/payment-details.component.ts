import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { UserserviceService } from 'src/app/services/userservice.service';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css']
})
export class PaymentDetailsComponent {
  
  payments!:any
  payments_to_display!:any
  userId!:any
  
  constructor(
    private _messageService:MessageToasterService,
    private _formBuilder:FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _userService:UserserviceService,
  ){}

  ngOnInit(): void {
    this.getAppointmentDetails()
    this.paymentForm.get('status')?.valueChanges.subscribe(value => {
      if(value) this.paymentFormSubmit()
    });
    this.userId=localStorage.getItem('userId')
    this.setupSearchSubscription();
  }

  getAppointmentDetails(){
    this._userService.get_booking_details_of_user({userId:localStorage.getItem('userId')}).subscribe({
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

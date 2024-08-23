import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { UserserviceService } from 'src/app/services/userservice.service';

declare var Razorpay:any;

@Component({
  selector: 'app-appointment-booking',
  templateUrl: './appointment-booking.component.html',
  styleUrls: ['./appointment-booking.component.css']
})

export class AppointmentBookingComponent implements OnInit{
  
  slotId!:any
  slotDetails!:any
  visible: boolean = false;
  namePattern = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*\s*$/;
  agePattern=/^(?:[1-9][0-9]?|10[0-9])$/;
  isDisable=true
  patient_details!:any
  userId=localStorage.getItem('userId')

  constructor(
    private _userService:UserserviceService,
    private _formBuilder:FormBuilder,
    private _messageService:MessageToasterService,
    private _router:Router,
  ){}

  ngOnInit(): void {
    this.slotId=localStorage.getItem('slotId')
    console.log('slotId from localStorage:',this.slotId)
    this._userService.getSlot({slotId:this.slotId}).subscribe({
      next:(Response)=>{
        this.slotDetails=Response
      },error:(error)=>{
        this._messageService.showErrorToastr(error.error.message)
      }
    })
  }

  patient_details_form=this._formBuilder.group({
    name:['sadf',[Validators.required,Validators.minLength(2),Validators.pattern(this.namePattern)]],
    email:['jndsf@gmail.com',[Validators.required,Validators.email]],
    age:['12',[Validators.required,Validators.pattern(this.agePattern)]],
    gender:['female',Validators.required],
    address:['dsf',Validators.required],
    reason_for_visit:['afsd',Validators.required]
  })

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  patient_details_form_submit(){
    if(this.patient_details_form.invalid){
      this.markFormGroupTouched(this.patient_details_form);
      return;
    }else{
      this.patient_details={
        slotId:this.slotId,
        userId:this.userId,
        doctorId:this.slotDetails.docId._id,
        patient_details:{
          name:this.patient_details_form.value.name,
          email:this.patient_details_form.value.email,
          age:this.patient_details_form.value.age,
          gender:this.patient_details_form.value.gender,
          address:this.patient_details_form.value.address,
          reason_for_visit:this.patient_details_form.value.reason_for_visit
        }
      }
      this.isDisable=false
    }
  }

  payment_form=this._formBuilder.group({
    payment_method:['online_payment',Validators.required]
  })

  payment_form_submit(){
    this._userService.check_if_the_slot_available({slotId:this.slotId}).subscribe({
      next:(Response)=>{
        if(this.payment_form.value.payment_method==='online_payment'){
          this.onlinePayment()
        }else if(this.payment_form.value.payment_method==='wallet_payment'){
          this.walletPayment()
        }else{
          this._messageService.showSuccessToastr('select any payment method')
        }
      },error:(error)=>{
        this._messageService.showErrorToastr(error.error.message)
      }
    })
  }


  onlinePayment(){
    this.isDisable=true
    const slot_id = this.slotDetails._id;
    this._userService.booking_payment({consultation_fee:this.slotDetails.docId.consultation_fee}).subscribe({   // For payment 
      next:(response)=>{
        // console.log('razorpay, booking response',response);
        this.razorpayPopUp(response);
      },
      error:(error)=>{
        console.log(error.message)
      }
    })
  }
  
  razorpayPopUp(res:any){
    console.log('razorpayPopUp');
    const RazorpayOptions = {
      description:'Medilink Razorpay payment',
      currency:'INR',
      amount:res.fee,
      name:'MediLink',
      key:res.key_id,
      order_id:res.order_id,
      image:'https://imgs.search.brave.com/bmhZt0Gh9CjW_Wk8CCob0T2V4PS_bHQYW3lfF_Ptlso/rs:fit:500:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA0LzM3LzM1LzA2/LzM2MF9GXzQzNzM1/MDY3Nl85Y1VibE1k/N29zNnNrZzA0VmE1/dUhhTWY1VFRaaEhX/Zy5qcGc',
      prefill:{
        name:'Medilink',
        email:'medilink@gmail.com',
        phone:'9876543211'
      },
      theme:{
        color:'#6466e3'
      },
      modal:{
        ondismiss:()=>{
          this._messageService.showWarningToastr('Payment Failed');
        }
      },
      handler:this.paymentSuccess.bind(this)
    }
    const rpz = new Razorpay(RazorpayOptions);
    rpz.open()
  }

  paymentSuccess(options:any){
    this.patient_details.payment_method='online_payment'
    this.patient_details.payment_status=true
    this.payment(this.patient_details)
 }

  walletPayment(){
    this.isDisable=false
    this._userService.userDetails({userId:this.userId}).subscribe({
      next:(Response)=>{
        if(Response.wallet<this.slotDetails.adminPaymentAmount){
          this._messageService.showErrorToastr('Insufficient Balance!')
        }else{
          this.patient_details.payment_method='wallet_payment'
          this.patient_details.payment_status=true
          this.payment(this.patient_details)
        }
      }
    })
  }

  payment(data:any){
    this._userService.appointmnet_booking(this.patient_details).subscribe({
      next:(Response)=>{
        this._messageService.showSuccessToastr(Response.message)
        //go to next page where the doctor profile page itself, where have the video call button and message button instead of slot booking list
        // this.router.navigate(['/user/doctor_profile',this.slotDetails.docId._id])
        this._router.navigate(['/user/success_payment',this.slotDetails.docId._id])
      },
      error:(error)=>{
        console.log(error.error);
        this._messageService.showErrorToastr(error.error.message)
      }
    })
  }
}

import { ChangeDetectorRef, Component, OnInit} from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { debounceTime } from "rxjs";
import { MessageToasterService } from "src/app/services/message-toaster.service";
import { UserserviceService } from "src/app/services/userservice.service";
import { PrescriptionModalComponent } from "../../shared/prescription-modal/prescription-modal.component";
import { DoctorService } from "src/app/services/doctor.service";
import { BookedSlotModel, BookedSlotModelPopulate } from "src/app/store/model/commonModel";

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.css']
})
export class BookingDetailsComponent implements OnInit{

  userId!:string
  appointments!:BookedSlotModelPopulate[]
  appointments_to_display!:any
  showModal=false
  selectedPrescription = {
    disease: '',
    prescription: ''
  };
  constructor(
    private _userService:UserserviceService,
    private _messageService:MessageToasterService,
    private _formBuilder:FormBuilder,
    private _cdr:ChangeDetectorRef,
    private _doctorService:DoctorService
  ){}

  ngOnInit(): void {
    this.getAppointmentDetails()
    this.setupSearchSubscription();
  }
  closeModal() {
    this.showModal = false;
  }

  getAppointmentDetails(){
    const userId=localStorage.getItem('userId')
    this._userService.getBookingDetails_of_user({userId:userId}).subscribe({
      next:(Response)=>{
        this.appointments=Response
        this.appointments_to_display=this.appointments
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
      this.appointments_to_display = this.appointments_to_display.filter((appointment:BookedSlotModelPopulate) =>
        regex.test(appointment.userId.firstName) ||
        regex.test(appointment.userId.lastName)||
        regex.test(appointment.doctorId.firstName)||
        regex.test(appointment.doctorId.lastName)
      );
    } else {
      this.appointments_to_display = this.appointments;
    }
  }

  consultationForm=this._formBuilder.group({
    status:['all']
  })

  consultationFormSubmit(){
    if(this.consultationForm.valid){
      const selectedStatus=this.consultationForm.value.status
      if(selectedStatus=='all'){
        this.appointments_to_display=this.appointments
      }else if(selectedStatus=='pending'){
        this.appointments_to_display = this.appointments.filter((item: { consultation_status: string; }) => 
            item.consultation_status=='pending'
        );
      }else if(selectedStatus=='consulted'){
        this.appointments_to_display = this.appointments.filter((item: { consultation_status: string; }) => 
          item.consultation_status=='consulted'
        );
      }else if(selectedStatus=='not_consulted'){
        this.appointments_to_display = this.appointments.filter((item: { consultation_status: string; }) => 
          item.consultation_status=='not_consulted'
        );
      }
      else if(selectedStatus=='cancelled'){
        this.appointments_to_display = this.appointments.filter((item: { consultation_status: string; }) => 
          item.consultation_status=='cancelled'
        );
      }
      this._cdr.detectChanges();
    }
  }

  changeStatus(data: BookedSlotModelPopulate) {
    const slotId = data.slotId._id;
    this._userService.cancelSlot({ slotId: slotId }).subscribe({
      next: (Response) => {
        this._messageService.showSuccessToastr(Response.message);
        this.updateInTable(slotId);
      },
      error: (error) => {
        console.log('error:',error.error)
        this._messageService.showErrorToastr(error.error.message);
      }
    });
  }
  
  updateInTable(slotId: string) {
    this.appointments_to_display = this.appointments_to_display.map((item: { slotId: any; consultation_status: string; }) => {
      if (item.slotId._id === slotId) {
        item.consultation_status = 'cancelled';
      }
      return item;
    });
    this._cdr.detectChanges();
  }
  openPrescriptionModal(payment: string) {
    console.log('slot details:',payment);
    
    this._userService.getPrescriptionDetails({slotId:payment}).subscribe({
      next:(Response)=>{
        console.log('prescription:',Response);
        this.selectedPrescription.disease = Response.disease || 'N/A';
        this.selectedPrescription.prescription = Response.prescription || 'N/A';
        this.showModal = true;
      }
    })
  }
}

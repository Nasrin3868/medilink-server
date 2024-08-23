import { ChangeDetectorRef, Component, OnInit} from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { debounceTime } from "rxjs";
import { MessageToasterService } from "src/app/services/message-toaster.service";
import { UserserviceService } from "src/app/services/userservice.service";
import { PrescriptionModalComponent } from "../../shared/prescription-modal/prescription-modal.component";

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.css']
})
export class BookingDetailsComponent implements OnInit{

  userId!:any
  appointments!:any
  appointments_to_display!:any

  constructor(
    private _userService:UserserviceService,
    private _messageService:MessageToasterService,
    private _formBuilder:FormBuilder,
    private _cdr:ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.getAppointmentDetails()
    this.setupSearchSubscription();
  }

  getAppointmentDetails(){
    const userId=localStorage.getItem('userId')
    this._userService.get_booking_details_of_user({userId:userId}).subscribe({
      next:(Response)=>{
        this.appointments=Response
        this.appointments_to_display=this.appointments
      },
      error:(error)=>{
        this._messageService.showErrorToastr(error.error.message)
      }
    })
  }

  // openPrescriptionModal(prescription_id: string) {
  //   console.log('openPrescriptionModal calls');
  //   const modal = document.querySelector('app-prescription-modal') as unknown as PrescriptionModalComponent;
  //   if (modal) {
  //     modal.prescription = prescription_id;
  //     modal.openModal();
  //   }
  // }
  openPrescriptionModal(prescription_id: string | null) {
    prescription_id="66b43fa6725d8689a520191f"
    console.log('Opening prescription modal with ID:', prescription_id);
    const modal = document.querySelector('app-prescription-modal') as unknown as PrescriptionModalComponent;
    if (modal) {
      modal.prescription_id = prescription_id;
      if (prescription_id) {
        modal.openModal
      } else {
        console.error('Invalid prescription ID:', prescription_id);
      }
    }
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
      this.appointments_to_display = this.appointments_to_display.filter((appointment:any) =>
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

  changeStatus(data: any) {
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
  
  updateInTable(slotId: any) {
    this.appointments_to_display = this.appointments_to_display.map((item: { slotId: any; consultation_status: string; }) => {
      if (item.slotId._id === slotId) {
        item.consultation_status = 'cancelled';
      }
      return item;
    });
    this._cdr.detectChanges();
  }
}

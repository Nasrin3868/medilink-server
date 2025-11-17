import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { DoctorService } from 'src/app/services/doctor.service';
import { MessageToasterService } from 'src/app/services/message-toaster.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit{
  payments!:any;
  payments_master: any[] = []; // Master list to always filter from
  payments_to_display: any[] = []; // List after search/status filtering (pre-pagination)
  doctorId!:string|null;
  
  // 🔑 PAGINATION VARIABLES
  currentPage: number = 1;
  itemsPerPage: number = 10; // Items per page
  totalPages: number = 1;

  // 🔑 FILTER STATE VARIABLE (for the status dropdown)
  currentStatusFilter: string = 'all'; 

  
  constructor(
    private _messageService:MessageToasterService,
    private _formBuilder:FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _doctorService:DoctorService,
  ){}

  ngOnInit(): void {
    this.doctorId=localStorage.getItem('doctorId')
    this.getAppointmentDetails()
    this.setupSearchSubscription()
  }

  // 🔑 PAGINATION GETTER: Returns the slice of data for the current page
  get paginated_payments(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.payments_to_display.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // 🔑 PAGINATION LOGIC
  updatePagination() {
    this.totalPages = Math.ceil(this.payments_to_display.length / this.itemsPerPage);
    this.currentPage = 1; // Reset to page 1 after filtering
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }


  getAppointmentDetails(){
    this._doctorService.getBookingsOfDoctor({doctorId:localStorage.getItem('doctorId')}).subscribe({
      next:(Response)=>{
        if(Response && Response.length !== 0){
          this.payments_master = Response; // Store the full data set
          this.payments_to_display = Response; // Initialize display list
          this.updatePagination(); // Initialize pagination
        } else {
          this.payments_master = [];
          this.payments_to_display = [];
          this.updatePagination();
        }
      },
      error:(error)=>{
        this._messageService.showErrorToastr(error.error.message)
        this.payments_master = [];
        this.payments_to_display = [];
        this.updatePagination();
      }
    })
  }

  searchForm=this._formBuilder.group({
    searchData:[''] // Removed Validators.required to allow blank search
  })

  setupSearchSubscription() {
    this.searchForm.get('searchData')?.valueChanges
      .pipe(debounceTime(300))
      .subscribe(value => {
          this.applyFilters(value); // Use combined filter logic
      });
  }

  // 🔑 NEW: Combined Filtering Function
  applyFilters(searchTerm: string|null|undefined) {
    let filteredList = this.payments_master; // Always start with the full master list

    // 1. Apply Status Filter
    if (this.currentStatusFilter !== 'all') {
      filteredList = filteredList.filter((item: any) => 
        item.consultation_status === this.currentStatusFilter
      );
    }
    
    // 2. Apply Search Filter
    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      filteredList = filteredList.filter((appointment:any) =>
        regex.test(appointment.userId.firstName) ||
        regex.test(appointment.userId.lastName) ||
        regex.test(appointment.consultation_status)
      );
    }
    
    this.payments_to_display = filteredList;
    this.updatePagination(); // Recalculate pages
  }

  // 🔑 NEW: Status Filter Handler (Called by the HTML select)
  filterByConsultationStatus(event: any) {
    this.currentStatusFilter = event.target.value;
    const searchTerm = this.searchForm.get('searchData')?.value;
    this.applyFilters(searchTerm);
  }
  
  // payments!:any
  // payments_to_display!:any
  // doctorId!:string|null
  
  // constructor(
  //   private _messageService:MessageToasterService,
  //   private _formBuilder:FormBuilder,
  //   private _cdr: ChangeDetectorRef,
  //   private _doctorService:DoctorService,
  // ){}

  // ngOnInit(): void {
  //   this.getAppointmentDetails()
  //   // this.consultationForm.get('status')?.valueChanges.subscribe(value => {
  //   //   if(value) this.consultationFormSubmit()
  //   // });
  //   this.doctorId=localStorage.getItem('doctorId')
  //   this.setupSearchSubscription()
  // }

  // getAppointmentDetails(){
  //   this._doctorService.getBookingsOfDoctor({doctorId:localStorage.getItem('doctorId')}).subscribe({
  //     next:(Response)=>{
  //       if(Response.length!==0){
  //         this.payments=Response
  //         this.payments_to_display=this.payments
  //       }else{
  //         this.payments_to_display=[]
  //       }
  //     },
  //     error:(error)=>{
  //       this._messageService.showErrorToastr(error.error.message)
  //     }
  //   })
  // }

  // searchForm=this._formBuilder.group({
  //   searchData:['',Validators.required]
  // })

  // setupSearchSubscription() {
  //   this.searchForm.get('searchData')?.valueChanges
  //     .pipe(debounceTime(300)) // Adjust debounce time as needed
  //     .subscribe(value => {
  //         this.filterDoctors(value);
  //     });
  // }

  // filterDoctors(searchTerm: string|null) {
  //   if (searchTerm) {
  //     const regex = new RegExp(searchTerm, 'i');
  //     this.payments_to_display = this.payments_to_display.filter((appointment:any) =>
  //       regex.test(appointment.userId.firstName)||
  //       regex.test(appointment.userId.lastName)||
  //       regex.test(appointment.consultation_status)
  //     );
  //   } else {
  //     this.payments_to_display = this.payments;
  //   }
  // }

  // consultationForm=this._formBuilder.group({
  //   status:['all']
  // })

  // consultationFormSubmit(){
  //   if(this.consultationForm.valid){
  //     const selectedStatus=this.consultationForm.value.status
  //     if(selectedStatus==='all'){
  //       this.payments_to_display=this.payments
  //     }else if(selectedStatus==='pending'){
  //       this.payments_to_display = this.payments.filter((item: any) => 
  //           item.consultation_status==='pending'
  //       );
  //     }else if(selectedStatus==='consulted'){
  //       this.payments_to_display = this.payments.filter((item: any) => 
  //         item.consultation_status==='consulted'
  //       );
  //     }else if(selectedStatus==='not_consulted'){
  //       this.payments_to_display = this.payments.filter((item: any) => 
  //         item.consultation_status==='not_consulted'
  //       );
  //     }else if(selectedStatus==='cancelled'){
  //       this.payments_to_display = this.payments.filter((item: any) => 
  //         item.consultation_status==='cancelled'
  //       );
  //     }
  //     this._cdr.detectChanges();
  //   }
  // }

}

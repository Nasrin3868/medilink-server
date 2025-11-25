import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { DoctorService } from 'src/app/services/doctor.service';
import { MessageToasterService } from 'src/app/services/message-toaster.service';

@Component({
  selector: 'app-doctor-booking-details',
  templateUrl: './doctor-booking-details.component.html',
  styleUrls: ['./doctor-booking-details.component.css']
})
export class DoctorBookingDetailsComponent implements OnInit {
  
  // State
  allBookings!:any[] // Master list (renamed from 'payments')
  filteredBookings!:any[] // Filtered list (renamed from 'payments_to_display')
  doctorId!:string|null
  isLoading: boolean = true; // NEW: Loading state

  // Pagination & Display State
  currentPage: number = 1; 
  itemsPerPage: number = 10; 
  pagedBookings: any[] = []; 
  
  // Modal State
  showModal=false
  selectedPrescription = {
    disease: '',
    prescription: ''
  };
  
  constructor(
    private _messageService:MessageToasterService,
    private _formBuilder:FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _doctorService:DoctorService,
  ){}

  closeModal() {
    this.showModal = false;
  }
  

  ngOnInit(): void {
    this.doctorId=localStorage.getItem('doctorId')
    this.getAppointmentDetails()
    this.setupFilterSubscription()
    this.setupSearchSubscription()
  }

  // Combines status filter and search subscription logic
  setupFilterSubscription() {
    this.consultationForm.get('status')?.valueChanges.subscribe(value => {
      if(value) this.applyFilter()
    });
  }

  setupSearchSubscription() {
    this.searchForm.get('searchData')?.valueChanges
      .pipe(debounceTime(300)) // Adjust debounce time as needed
      .subscribe(value => {
          this.applyFilter(); // Apply both search and filter
      });
  }

  getAppointmentDetails(){
    this.isLoading = true;
    this._doctorService.getBookingDetails_of_doctor({doctorId:localStorage.getItem('doctorId')}).subscribe({
      next:(Response)=>{
        this.allBookings = Response;
        
        // 1. Sort master list by slot time (Newest to Oldest)
        this.allBookings.sort((a: any, b: any) => {
            const dateA = new Date(a.slotId.time).getTime();
            const dateB = new Date(b.slotId.time).getTime();
            return dateB - dateA; // Descending order (Newest first)
        });

        // 2. Initialize filtered list and apply first page pagination
        this.filteredBookings = [...this.allBookings];
        this.applyPagination();

        this.isLoading = false;
      },
      error:(error)=>{
        this._messageService.showErrorToastr(error.error.message)
        this.isLoading = false;
      }
    })
  }

  searchForm=this._formBuilder.group({
    searchData:[''] // Set empty initial value, not ['']
  })

  consultationForm=this._formBuilder.group({
    status:['all']
  })

  // Combined filter/search logic
  applyFilter(){
    this.currentPage = 1; // Reset to first page on any filter/search change
    
    const selectedStatus = this.consultationForm.value.status;
    const searchTerm = this.searchForm.get('searchData')?.value;

    let workingList = [...this.allBookings]; // Start with the sorted master list

    // 1. Apply Status Filter
    if(selectedStatus && selectedStatus !== 'all'){
      workingList = workingList.filter((item: any) => 
          item.consultation_status === selectedStatus
      );
    }
    
    // 2. Apply Search Term Filter
    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      workingList = workingList.filter((appointment:any) =>
        regex.test(appointment.userId.firstName)||
        regex.test(appointment.userId.lastName)
      );
    }
    
    // 3. Update the filtered list and pagination
    this.filteredBookings = workingList;
    this.applyPagination();
    this._cdr.detectChanges();
  }
  
  // Method bound to the form select change
  consultationFormSubmit() {
    this.applyFilter();
  }
  
  // --- Pagination Methods ---
  
  applyPagination(): void {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.pagedBookings = this.filteredBookings.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
      return Math.ceil(this.filteredBookings.length / this.itemsPerPage);
  }
  
  changePage(page: number): void {
      if (page >= 1 && page <= this.getTotalPages()) {
          this.currentPage = page;
          this.applyPagination();
          this._cdr.detectChanges();
      }
  }
  
  // --- Modal Logic ---
  
  openPrescriptionModal(payment: any) {
    this._doctorService.getPrescriptionDetails({slotId:payment}).subscribe({
      next:(Response)=>{
        this.selectedPrescription.disease = Response.disease || 'N/A';
        this.selectedPrescription.prescription = Response.prescription || 'N/A';
        this.showModal = true;
      },
      error: (error) => {
        this._messageService.showErrorToastr("Failed to fetch prescription: " + error.error.message);
      }
    })
  }

}
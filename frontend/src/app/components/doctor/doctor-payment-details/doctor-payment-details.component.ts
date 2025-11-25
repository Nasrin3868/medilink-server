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
  
  // State
  payments!:any[] // Master list (renamed from 'payments')
  filteredPayments!:any[] // Filtered list (renamed from 'payments_to_display')
  doctorId!:any
  isLoading: boolean = true; // NEW: Loading state

  // Pagination & Display State
  currentPage: number = 1; 
  itemsPerPage: number = 10; 
  pagedPayments: any[] = []; 
  
  constructor(
    private _messageService:MessageToasterService,
    private _formBuilder:FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _doctorService:DoctorService,
  ){}

  ngOnInit(): void {
    this.doctorId=localStorage.getItem('doctorId')
    this.getPaymentDetails()
    this.setupSearchSubscription()
  }

  getPaymentDetails(){
    this.isLoading = true;
    this._doctorService.getBookingDetails_of_doctor({doctorId:localStorage.getItem('doctorId')}).subscribe({
      next:(Response)=>{
        this.payments = Response;
        
        // 1. Sort master list by slot time (Newest to Oldest)
        this.payments.sort((a: any, b: any) => {
            const dateA = new Date(a.slotId.time).getTime();
            const dateB = new Date(b.slotId.time).getTime();
            return dateB - dateA; // Descending order (Newest first)
        });

        // 2. Initialize filtered list and apply first page pagination
        this.filteredPayments = [...this.payments];
        this.applyPagination();

        this.isLoading = false;
      },
      error:(error)=>{
        this._messageService.showErrorToastr(error.error.message)
        this.isLoading = false;
      }
    })
  }
  
  // Renamed search form and control for clarity (Removed Validators.required)
  searchForm=this._formBuilder.group({
    searchTerm:['']
  })

  setupSearchSubscription() {
    this.searchForm.get('searchTerm')?.valueChanges
      .pipe(debounceTime(300))
      .subscribe(value => {
          this.currentPage = 1; // Reset page on search
          this.applyFilter();
      });
  }

  paymentForm=this._formBuilder.group({
    status:['all']
  })

  // Combined filter/search logic
  applyFilter() {
    const selectedStatus = this.paymentForm.value.status;
    const searchTerm = this.searchForm.get('searchTerm')?.value;
    
    let workingList = [...this.payments]; // Start with the sorted master list

    // 1. Apply Payment Status Filter
    if(selectedStatus && selectedStatus !== 'all'){
      const method = selectedStatus === 'onlinePayment' ? 'online_payment' : 'wallet_payment';
      workingList = workingList.filter((item: { payment_method: string; }) => 
          item.payment_method === method
      );
    }
    
    // 2. Apply Search Term Filter
    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      workingList = workingList.filter((appointment:any) =>
        regex.test(appointment.userId.firstName) ||
        regex.test(appointment.userId.lastName) ||
        regex.test(appointment.slotId.bookingAmount.toString()) ||
        regex.test(appointment.payment_method)
      );
    }
    
    // 3. Update the filtered list and pagination
    this.filteredPayments = workingList;
    this.currentPage = 1; // Always reset pagination index here
    this.applyPagination();
    this._cdr.detectChanges();
  }
  
  // Method bound to the form select change
  paymentFormSubmit() {
    this.applyFilter();
  }

  // --- Pagination Methods ---
  
  applyPagination(): void {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.pagedPayments = this.filteredPayments.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
      return Math.ceil(this.filteredPayments.length / this.itemsPerPage);
  }
  
  changePage(page: number): void {
      if (page >= 1 && page <= this.getTotalPages()) {
          this.currentPage = page;
          this.applyPagination();
          this._cdr.detectChanges();
      }
  }

}
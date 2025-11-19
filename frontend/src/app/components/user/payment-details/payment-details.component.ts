import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { UserserviceService } from 'src/app/services/userservice.service';
import { BookedSlotModel, BookedSlotModelPopulate } from 'src/app/store/model/commonModel';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css']
})
export class PaymentDetailsComponent implements OnInit {
  
  // State
  userId!:string
  isLoading: boolean = true; // NEW: Loading state

  // Pagination & Display State
  currentPage: number = 1; 
  itemsPerPage: number = 10; 
  pagedPayments: BookedSlotModelPopulate[] = []; // Payments for the current page
  
  // Data
  allPayments!:BookedSlotModelPopulate[] // Renamed for clarity
  filteredPayments!:BookedSlotModelPopulate[] // Renamed for clarity
  
  constructor(
    private _messageService:MessageToasterService,
    private _formBuilder:FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _userService:UserserviceService,
  ){}

  ngOnInit(): void {
    this.userId=localStorage.getItem('userId')||''
    this.getPaymentDetails()
    // Subscribing to valueChanges is now integrated into getPaymentDetails completion
    this.setupSearchSubscription();
  }

  getPaymentDetails(){
    this.isLoading = true;
    this._userService.getBookingDetails_of_user({userId:this.userId}).subscribe({
      next:(Response)=>{
        this.allPayments = Response.filter((payment:BookedSlotModelPopulate) => payment.payment_status === true || payment.payment_method);
        
        // 1. Sort data: Newest to Oldest (by slot time)
        this.sortPaymentsNewestFirst(); 
        
        // 2. Set the initially filtered list to the sorted master list
        this.filteredPayments = [...this.allPayments];
        
        // 3. Apply pagination to display the first page
        this.applyPagination();

        this.isLoading = false;
      },
      error:(error)=>{
        this._messageService.showErrorToastr(error.error.message)
        this.isLoading = false;
      }
    })
  }
  
  /**
   * Sorts the payments in the master list by slot time (newest first).
   */
  sortPaymentsNewestFirst(): void {
      this.allPayments.sort((a, b) => {
          const dateA = new Date(a.slotId.time).getTime();
          const dateB = new Date(b.slotId.time).getTime();
          return dateB - dateA; // Descending order (Newest first)
      });
  }

  // Renamed search form and control for clarity
  searchForm=this._formBuilder.group({
    searchTerm:['']
  })

  setupSearchSubscription() {
    this.searchForm.get('searchTerm')?.valueChanges
      .pipe(debounceTime(300))
      .subscribe(value => {
          this.currentPage = 1; // Reset to first page on search
          this.filterPaymentsBySearch(value ?? null);
      });
  }

  filterPaymentsBySearch(searchTerm: string|null) {
    // 1. Re-apply payment status filter first to get the base list
    let tempPayments = this.allPayments; 
    const selectedStatus = this.paymentForm.value.status;
    if (selectedStatus && selectedStatus !== 'all') {
        const method = selectedStatus === 'onlinePayment' ? 'online_payment' : 'wallet_payment';
        tempPayments = tempPayments.filter(item => item.payment_method === method);
    }

    // 2. Apply text search on the base list
    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      this.filteredPayments = tempPayments.filter((payment:BookedSlotModelPopulate) =>
        regex.test(payment.slotId.docId.firstName) || // Check doctor's first name
        regex.test(payment.slotId.docId.lastName) || // Check doctor's last name
        regex.test(payment.slotId.bookingAmount.toString()) ||
        regex.test(payment.payment_method)
      );
    } else {
      this.filteredPayments = tempPayments;
    }
    
    this.currentPage = 1; // Always reset pagination
    this.applyPagination();
    this._cdr.detectChanges();
  }

  // Renamed filter form for clarity
  paymentForm=this._formBuilder.group({
    status:['all']
  })

  paymentFormSubmit(){
    this.currentPage = 1; // Reset to first page on filter change
    this.filterPaymentsBySearch(this.searchForm.get('searchTerm')?.value ?? null); // Run search/filter logic
  }
  
  /**
   * Core pagination logic. Updates pagedPayments based on currentPage.
   */
  applyPagination(): void {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.pagedPayments = this.filteredPayments.slice(startIndex, endIndex);
  }

  /**
   * Calculate total number of pages.
   */
  getTotalPages(): number {
      return Math.ceil(this.filteredPayments.length / this.itemsPerPage);
  }
  
  /**
   * Change current page and update the display list.
   */
  changePage(page: number): void {
      if (page >= 1 && page <= this.getTotalPages()) {
          this.currentPage = page;
          this.applyPagination();
      }
  }
}
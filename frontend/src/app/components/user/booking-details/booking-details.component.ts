// import { ChangeDetectorRef, Component, OnInit} from "@angular/core";
// import { FormBuilder, Validators } from "@angular/forms";
// import { debounceTime } from "rxjs";
// import { MessageToasterService } from "src/app/services/message-toaster.service";
// import { UserserviceService } from "src/app/services/userservice.service";
// import { BookedSlotModelPopulate } from "src/app/store/model/commonModel";
// import Swal from 'sweetalert2'; // Assuming Swal is installed for confirmation modal

// @Component({
//   selector: 'app-booking-details',
//   templateUrl: './booking-details.component.html',
//   styleUrls: ['./booking-details.component.css']
// })
// export class BookingDetailsComponent implements OnInit{

//   // State
//   userId!:string
//   isLoading: boolean = true;
  
//   // Pagination & Display State
//   currentPage: number = 1; // Current page number
//   itemsPerPage: number = 10; // Number of items per page
//   pagedAppointments: BookedSlotModelPopulate[] = []; // Appointments for the current page

//   // Data
//   allAppointments!:BookedSlotModelPopulate[]
//   filteredAppointments!:BookedSlotModelPopulate[]
  
//   // Modal State
//   showModal=false
//   selectedPrescription = {
//     disease: '',
//     prescription: ''
//   };

//   constructor(
//     private _userService:UserserviceService,
//     private _messageService:MessageToasterService,
//     private _formBuilder:FormBuilder,
//     private _cdr:ChangeDetectorRef,
//   ){}

//   ngOnInit(): void {
//     this.getAppointmentDetails()
//     this.setupSearchSubscription();
//   }
  
//   closeModal() {
//     this.showModal = false;
//   }

//   getAppointmentDetails(){
//     const userId=localStorage.getItem('userId')
//     this.isLoading = true;
    
//     this._userService.getBookingDetails_of_user({userId:userId}).subscribe({
//       next:(Response)=>{
//         // 1. Store all data
//         this.allAppointments = Response;
        
//         // 2. Sort data: Newest to Oldest (Descending order)
//         this.sortAppointmentsNewestFirst(); 
        
//         // 3. Set the initially filtered list to the sorted master list
//         this.filteredAppointments = [...this.allAppointments];
        
//         // 4. Apply pagination to display the first page
//         this.applyPagination();
        
//         this.isLoading = false;
//       },
//       error:(error)=>{
//         this._messageService.showErrorToastr(error.error.message)
//         this.isLoading = false;
//       }
//     })
//   }
  
//   /**
//    * Sorts the appointments in the master list by date/time (newest first).
//    * We use the slot time for sorting.
//    */
//   sortAppointmentsNewestFirst(): void {
//       this.allAppointments.sort((a, b) => {
//           const dateA = new Date(a.slotId.time).getTime();
//           const dateB = new Date(b.slotId.time).getTime();
//           return dateB - dateA; // Descending order (Newest first)
//       });
//   }

//   // RENAMED form group
//   searchForm=this._formBuilder.group({
//     searchTerm:[''] // Removed Validators.required to allow empty search
//   })
  
//   // RENAMED form group
//   statusFilterForm=this._formBuilder.group({
//     status:['all']
//   })

//   setupSearchSubscription() {
//     this.searchForm.get('searchTerm')?.valueChanges
//       .pipe(debounceTime(300))
//       .subscribe(value => {
//           this.currentPage = 1; // Reset to first page on search
//           this.filterAppointmentsBySearch(value);
//       });
//   }

//   filterAppointmentsBySearch(searchTerm: string|null) {
//     // 1. Re-apply status filter first to get the base list
//     let tempAppointments = this.allAppointments; 
//     const selectedStatus = this.statusFilterForm.value.status;
//     if (selectedStatus && selectedStatus !== 'all') {
//         tempAppointments = tempAppointments.filter(item => item.consultation_status === selectedStatus);
//     }

//     // 2. Apply text search on the base list
//     if (searchTerm) {
//       const regex = new RegExp(searchTerm, 'i');
//       this.filteredAppointments = tempAppointments.filter((appointment:BookedSlotModelPopulate) =>
//         regex.test(appointment.slotId.docId.firstName) ||
//         regex.test(appointment.slotId.docId.lastName)
//       );
//     } else {
//       this.filteredAppointments = tempAppointments;
//     }
    
//     this.currentPage = 1; // Always reset pagination
//     this.applyPagination();
//     this._cdr.detectChanges();
//   }

//   applyFilter(){ 
//     this.currentPage = 1; // Reset to first page on filter change
//     this.filterAppointmentsBySearch(this.searchForm.get('searchTerm')?.value ?? null); // Run search/filter logic
//   }
  
//   /**
//    * Core pagination logic. Updates pagedAppointments based on currentPage.
//    */
//   applyPagination(): void {
//       const startIndex = (this.currentPage - 1) * this.itemsPerPage;
//       const endIndex = startIndex + this.itemsPerPage;
//       this.pagedAppointments = this.filteredAppointments.slice(startIndex, endIndex);
//   }

//   /**
//    * Calculate total number of pages.
//    */
//   getTotalPages(): number {
//       return Math.ceil(this.filteredAppointments.length / this.itemsPerPage);
//   }
  
//   /**
//    * Change current page and update the display list.
//    */
//   changePage(page: number): void {
//       if (page >= 1 && page <= this.getTotalPages()) {
//           this.currentPage = page;
//           this.applyPagination();
//       }
//   }

//   // --- Cancellation Logic --- (Kept as provided/revised)

//   changeStatus(data: BookedSlotModelPopulate) {
//     const slotId = data.slotId._id;
//     const doctorName = `Dr. ${data.slotId.docId.firstName} ${data.slotId.docId.lastName}`;

//     Swal.fire({
//       title: 'Are you sure?',
//       text: `Do you really want to cancel your appointment with ${doctorName}? This action cannot be undone.`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//       cancelButtonColor: '#3085d6',
//       confirmButtonText: 'Yes, Cancel it!'
//     }).then((result) => {
//       if (result.isConfirmed) {
//         this.executeCancellation(slotId);
//       }
//     });
//   }

//   private executeCancellation(slotId: string) {
//     this._userService.cancelSlot({ slotId: slotId }).subscribe({
//       next: (Response) => {
//         this._messageService.showSuccessToastr(Response.message);
//         this.updateAppointmentStatus(slotId, 'cancelled');
//         Swal.fire(
//           'Cancelled!',
//           'Your appointment has been successfully cancelled.',
//           'success'
//         );
//       },
//       error: (error) => {
//         console.log('error:',error.error)
//         this._messageService.showErrorToastr(error.error.message);
//         Swal.fire(
//           'Error!',
//           'Failed to cancel the appointment.',
//           'error'
//         );
//       }
//     });
//   }
  
//   updateAppointmentStatus(slotId: string, status: string) {
//     this.allAppointments = this.allAppointments.map((item: BookedSlotModelPopulate) => {
//         if (item.slotId._id === slotId) {
//           item.consultation_status = status;
//         }
//         return item;
//     });
//     // Re-run the filter/pagination to update the display list immediately
//     this.applyFilter(); 
//     this._cdr.detectChanges();
//   }
  
//   openPrescriptionModal(slotId: string) {
//     // Existing logic is preserved
//     this._userService.getPrescriptionDetails({slotId:slotId}).subscribe({
//       next:(Response)=>{
//         this.selectedPrescription.disease = Response.disease || 'N/A';
//         this.selectedPrescription.prescription = Response.prescription || 'N/A';
//         this.showModal = true;
//       },
//       error:(error)=>{
//          this._messageService.showErrorToastr("Failed to fetch prescription: "+error.error.message);
//       }
//     })
//   }
// }
import { ChangeDetectorRef, Component, OnInit} from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { debounceTime } from "rxjs";
import { MessageToasterService } from "src/app/services/message-toaster.service";
import { UserserviceService } from "src/app/services/userservice.service";
import { PrescriptionModalComponent } from "../../shared/prescription-modal/prescription-modal.component";
import { DoctorService } from "src/app/services/doctor.service";
import { BookedSlotModel, BookedSlotModelPopulate } from "src/app/store/model/commonModel";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.css']
})
export class BookingDetailsComponent implements OnInit{

  // State
  userId!:string
  isLoading: boolean = true; // NEW: Loading state

  // Data
  allAppointments!:BookedSlotModelPopulate[] // RENAMED from 'appointments'
  filteredAppointments!:BookedSlotModelPopulate[] // RENAMED from 'appointments_to_display'
  
  // Modal State
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
    // private _doctorService:DoctorService // Removed unused DoctorService
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
    this.isLoading = true; // Set loading state before fetching
    
    this._userService.getBookingDetails_of_user({userId:userId}).subscribe({
      next:(Response)=>{
        this.allAppointments = Response
        this.filteredAppointments = this.allAppointments.sort((a, b) => {
            const dateA = new Date(a.slotId.time).getTime();
            const dateB = new Date(b.slotId.time).getTime();
            return dateB - dateA; // Descending order (Newest first)
        });
        this._cdr.detectChanges();
        this.isLoading = false; // Turn off loading on success
      },
      error:(error)=>{
        this._messageService.showErrorToastr(error.error.message)
        this.isLoading = false; // Turn off loading on error
      }
    })
  }

  // RENAMED form group
  searchForm=this._formBuilder.group({
    searchTerm:['',Validators.required] // RENAMED control from 'searchData'
  })

  setupSearchSubscription() {
    // Used new control name 'searchTerm'
    this.searchForm.get('searchTerm')?.valueChanges
      .pipe(debounceTime(300)) 
      .subscribe(value => {
          this.filterAppointmentsBySearch(value); // Updated function call
      });
  }

  // RENAMED function
  filterAppointmentsBySearch(searchTerm: string|null) {
    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      this.filteredAppointments = this.allAppointments.filter((appointment:BookedSlotModelPopulate) =>
        // Filtering by Doctor's name (Doctor is the more relevant search for a patient history)
        regex.test(appointment.slotId.docId.firstName) ||
        regex.test(appointment.slotId.docId.lastName)
      );
    } else {
      // Revert to all appointments, then re-apply current status filter
      this.filteredAppointments = this.allAppointments;
      this.applyFilter(); 
    }
  }

  // RENAMED form group
  statusFilterForm=this._formBuilder.group({
    status:['all']
  })

  // RENAMED function to reflect general filtering
  applyFilter(){ 
    if(this.statusFilterForm.valid){
      const selectedStatus=this.statusFilterForm.value.status
      
      let tempAppointments = this.allAppointments; // Start with all original data
      
      if(selectedStatus !== 'all'){
        tempAppointments = this.allAppointments.filter((item: { consultation_status: string; }) => 
            item.consultation_status === selectedStatus
        );
      }
      
      this.filteredAppointments = tempAppointments;
      
      // Re-apply search filter if there is a search term active
      const currentSearchTerm = this.searchForm.get('searchTerm')?.value;
      if (currentSearchTerm) {
         this.filterAppointmentsBySearch(currentSearchTerm);
      }

      this._cdr.detectChanges();
    }
  }
  changeStatus(data: BookedSlotModelPopulate) {
    const slotId = data.slotId._id;
    const doctorName = `Dr. ${data.slotId.docId.firstName} ${data.slotId.docId.lastName}`;

    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to cancel your appointment with ${doctorName}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33', // Red color for danger confirmation
      cancelButtonColor: '#3085d6', // Blue color for cancel
      confirmButtonText: 'Yes, Cancel it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed cancellation, proceed with the API call
        this.executeCancellation(slotId);
      }
    });
  }
  executeCancellation(data: string) {
    // Existing logic is preserved
    const slotId = data;
    this._userService.cancelSlot({ slotId: slotId }).subscribe({
      next: (Response) => {
        Swal.fire({
          title: 'Cancelled!',
          text: `Your appointment has been successfully cancelled.`,
          icon: 'success',
          showConfirmButton: true,
          confirmButtonText: 'OK',
          cancelButtonColor: '#d33', // Blue color for cancel
        })
      
        this._messageService.showSuccessToastr(Response.message);
        this.updateAppointmentStatus(slotId, 'cancelled');
      },
      error: (error) => {
        console.log('error:',error.error)
        Swal.fire({
          title: 'Error!',
          text: `${error.error.message}`,
          icon: 'error',
          showConfirmButton: true,
          confirmButtonText: 'OK',
          cancelButtonColor: 'rgba(234, 52, 52, 1)', // Blue color for cancel
        })
        // this._messageService.showErrorToastr(error.error.message);
      }
    });
  }
  
  // RENAMED function for clarity
  updateAppointmentStatus(slotId: string, status: string) {
    // Update the master list first
    this.allAppointments = this.allAppointments.map((item: BookedSlotModelPopulate) => {
        if (item.slotId._id === slotId) {
          // return a new object to ensure we keep all properties of BookedSlotModelPopulate
          return { ...item, consultation_status: status } as BookedSlotModelPopulate;
        }
        return item;
    });
    
    // Then re-run the filter to update the display list based on the new status
    this.applyFilter();
    this._cdr.detectChanges();
  }
  
  openPrescriptionModal(slotId: string) {
    // Existing logic is preserved
    this._userService.getPrescriptionDetails({slotId:slotId}).subscribe({
      next:(Response)=>{
        this.selectedPrescription.disease = Response.disease || 'N/A';
        this.selectedPrescription.prescription = Response.prescription || 'N/A';
        this.showModal = true;
      },
      error:(error)=>{
         this._messageService.showErrorToastr("Failed to fetch prescription: "+error.error.message);
      }
    })
  }
  
}


import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { DoctorService } from 'src/app/services/doctor.service';
import Swal from 'sweetalert2'; // <-- Import SweetAlert2

@Component({
  selector: 'app-slot-adding',
  templateUrl: './slot-adding.component.html',
  styleUrls: ['./slot-adding.component.css'],
})

export class SlotAddingComponent implements OnInit {

  date!: Date;
  minDate!: Date;
  maxDate!: Date;
  slots: any[] = [];
  clickedSlots: any = [];
  preSelected_slots: any[] = [];
  slots_for_display: any[] = [];
  existingSlots: any[] = [];
  doctorId:any=[]

  constructor(
    private _messageservice: MessageToasterService,
    private _doctorService: DoctorService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.doctorId=localStorage.getItem('doctorId');
    let today = new Date();
    this.minDate = new Date();
    this.maxDate = new Date(today.setMonth(today.getMonth() + 1));
    this.getSlots();
    this.date = new Date();
  }

  getSlots() {
    this._doctorService.getSlots({ _id: this.doctorId }).subscribe({
      next: (Response) => {
        this.slots = Response;
        this.onDateChange(this.date);
      },
      error: (error) => {
        // Show Swal error for initial fetch failure
        Swal.fire('Error', 'Failed to fetch existing slots: ' + error.error.message, 'error');
      },
    });
  }

  onDateChange(event: any){
    this.date = event;
    this.generateISO8601Dates(this.date);
    this.removeExistingSlots()
  }

  addSlots(time: string, index: number) {
    if (!this.date) {
      Swal.fire('Warning', 'Please select a date before adding a slot.', 'warning');
      return;
    } 
    
    // Confirmation modal before adding a single slot
    Swal.fire({
        title: 'Confirm Slot Addition?',
        text: `Do you want to add the slot at ${new Date(time).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})} for ${new Date(time).toLocaleDateString()}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Add Slot',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            const data = { time: time, _id: this.doctorId };
            this._doctorService.addSlots(data).subscribe({
                next: (Response) => {
                    Swal.fire('Success!', 'Slot added successfully.', 'success');
                    this.slots.push(Response.slot);
                    this.sort_slots();
                    this.slots_for_display.splice(index, 1);
                },
                error: (error) => {
                    Swal.fire('Error', 'Failed to add slot: ' + error.error.message, 'error');
                },
            });
        }
    });
  }

  generateISO8601Dates(inputDate: any) {
    const baseDate = new Date(inputDate);
    this.slots_for_display = [];

    // Set time to 9:00 AM if before
    if (baseDate.getHours() < 9) {
      baseDate.setHours(9, 0, 0, 0);
    } else {
      let minutes = baseDate.getMinutes();
      if (minutes > 0 && minutes <= 30) {
        baseDate.setMinutes(30);
      } else if (minutes > 30) {
        baseDate.setHours(baseDate.getHours() + 1);
        baseDate.setMinutes(0);
      } else {
        baseDate.setMinutes(0);
      }
      baseDate.setSeconds(0);
      baseDate.setMilliseconds(0);
    }
    let currentTime = baseDate;
    while (currentTime.getHours() < 20 || (currentTime.getHours() === 20 && currentTime.getMinutes() <= 30)) {
      this.slots_for_display.push(currentTime.toISOString());
      currentTime = new Date(currentTime.getTime() + 30 * 60000);
    }
    this.removeExistingSlots();
  }

  removeExistingSlots(): void {
    this.existingSlots = this.slots.map((slot: { time: any; }) => slot.time);

    this.slots_for_display = this.slots_for_display.filter((slotDate: string) => {
        return !this.existingSlots.includes(slotDate);
    });
  }

  remove_slot(slot: any, i: number) {
    // Confirmation modal before removal
    Swal.fire({
        title: 'Confirm Removal?',
        text: `Do you want to remove the slot at ${new Date(slot.time).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})} on ${new Date(slot.time).toLocaleDateString()}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Remove Slot',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#d33',
    }).then((result) => {
        if (result.isConfirmed) {
            this._doctorService.removeSlot({ _id: slot._id }).subscribe({
                next: (Response) => {
                    Swal.fire('Removed!', Response.message, 'success');
                    this.slots.splice(i, 1);
                    
                    const displayDate = new Date(Date.UTC(
                        this.date.getFullYear(), 
                        this.date.getMonth(), 
                        this.date.getDate()
                    )).toISOString().split('T')[0];
                    const slotDate = new Date(slot.time).toISOString().split('T')[0];
                    
                    if (slotDate === displayDate) {
                        this.slots_for_display.push(slot.time);
                        this.sort_slots_for_display();
                        this._cdr.detectChanges();
                    }
                },
                error: (error) => {
                    Swal.fire('Error', 'Failed to remove slot: ' + error.error.message, 'error');
                },
            });
        }
    });
  }

  sort_slots_for_display() {
    this.slots_for_display.sort((a: any, b: any) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });
  }

  sort_slots() {
    this.slots.sort((a: any, b: any) => {
      return new Date(a.time).getTime() - new Date(b.time).getTime();
    });
  }
  

  defaultSlots(){
    if(this.slots_for_display.length===0){
      Swal.fire('Info', 'No slots available to add for this date.', 'info');
    }else{
        // Confirmation modal before adding all slots
        Swal.fire({
            title: 'Add All Available Slots?',
            text: `You are about to add ${this.slots_for_display.length} slots for ${this.date.toLocaleDateString()}. Confirm?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Add All',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                this._doctorService.addAllSlots({slots:this.slots_for_display,doctorId:this.doctorId}).subscribe({
                    next:(Response)=>{
                        Swal.fire('Success!', 'All slots added successfully.', 'success');
                        this.slots.push(...Response); 
                        this.sort_slots()
                        this.slots_for_display = [];
                    },
                    error:(error)=>{
                        Swal.fire('Error', 'Failed to add slots: ' + error.error.message, 'error');
                    }
                });
            }
        });
    }
  }
  
}
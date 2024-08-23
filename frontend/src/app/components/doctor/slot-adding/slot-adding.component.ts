import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

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
        // this.slots = Response.filter((slot: any) => !slot.booked);
        this.slots = Response;
        this.onDateChange(this.date);
      },
      error: (error) => {
        console.log(error.error.message);
      },
    });
  }

  onDateChange(event: any){
    this.date = event;
    this.generateISO8601Dates(this.date);
    console.log('onDateChange',event)  //example of event: Sun Aug 11 2024 21:04:54 GMT+0530 (India Standard Time)
    this.removeExistingSlots()
  }

  addSlots(time: string, index: number) {
    if (!this.date) {
      this._messageservice.showErrorToastr('select any date!!');
    } else {
      const data = { time: time, _id: this.doctorId }; //time example: 2024-08-11T13:00:00.000+00:00
      this._doctorService.addSlots(data).subscribe({
        next: (Response) => {
          this._messageservice.showSuccessToastr('slot added');
          this.slots.push(Response.slot);
          this.sort_slots();
          this.slots_for_display.splice(index, 1);
          // this._cdr.detectChanges(); // Trigger change detection after modifying the array
        },
        error: (error) => {
          this._messageservice.showErrorToastr(error.error.message);
        },
      });
    }
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
    // Ensure existingSlots is up-to-date
    this.existingSlots = this.slots.map((slot: { time: any; }) => slot.time);

    // Filter out existing slots from slots_for_display
    this.slots_for_display = this.slots_for_display.filter((slotDate: string) => {
        return !this.existingSlots.includes(slotDate);
    });
  }

  remove_slot(slot: any, i: number) {
    console.log('date in display while removing slot:',this.date)
    console.log('slot date while removing:',slot.time);
    this._doctorService.removeSlot({ _id: slot._id }).subscribe({
      next: (Response) => {
        this._messageservice.showSuccessToastr(Response.message);
        this.slots.splice(i, 1);
         // Normalize `this.date` to UTC midnight
         const displayDate = new Date(Date.UTC(
          this.date.getFullYear(), 
          this.date.getMonth(), 
          this.date.getDate()
        )).toISOString().split('T')[0]; // yyyy-MM-dd
        const slotDate = new Date(slot.time).toISOString().split('T')[0]; // yyyy-MM-dd
        if (slotDate === displayDate) {
            this.slots_for_display.push(slot.time);
            this.sort_slots_for_display();
            this._cdr.detectChanges(); // Trigger change detection after modifying the array
        }
      },
      error: (error) => {
        this._messageservice.showErrorToastr(error.error.message);
      },
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
    console.log('slots length:',this.slots.length);
  }
  

  defaultSlots(){
    if(this.slots_for_display.length===0){
      this._messageservice.showErrorToastr('No slots available')
    }else{
      this._doctorService.add_all_slots({slots:this.slots_for_display,doctorId:this.doctorId}).subscribe({
        next:(Response)=>{
          this._messageservice.showSuccessToastr('Slots added successfully')
          this.slots.push(...Response); 
          this.sort_slots()
          this.slots_for_display = [];
        },error:(error)=>{
          this._messageservice.showErrorToastr(error.error.message)
        }
      })
    }
  }
  
}
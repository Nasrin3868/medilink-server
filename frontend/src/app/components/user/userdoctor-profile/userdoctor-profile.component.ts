import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { doctorData } from 'src/app/admin/model/docotrModel';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { UserserviceService } from 'src/app/services/userservice.service';

@Component({
  selector: 'app-userdoctor-profile',
  templateUrl: './userdoctor-profile.component.html',
  styleUrls: ['./userdoctor-profile.component.css']
})
export class UserdoctorProfileComponent implements OnInit {

  doctorId!: any;
  doctor!: doctorData;
  slots: any[] = [];
  date!: Date;
  minDate!: Date;
  maxDate!: Date;
  slots_for_display: any[] = [];
  userId!: any
  selectedTab: string = 'about';
  showModal: boolean = false;
  selectedSlot: any;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _userService: UserserviceService,
    private _messageService: MessageToasterService,
  ) { }

  ngOnInit(): void {
    this.doctorId = this._route.snapshot.paramMap.get('id');
    this.getdoctorDetails(this.doctorId);
    this.getSlots(this.doctorId);
    this.userId = localStorage.getItem('userId')

    //observable example

    // let observable=new Observable((observer=>{
    //   observer.next(Math.random()*100)
    // }))
    // observable.subscribe(result=>{
    //   console.log(result);
    // })
    // observable.subscribe(result=>{
    //   console.log(result);
    // })

    // subject example

    // let subject=new Subject()
    // subject.subscribe((result=>{
    //   console.log(result);
    // }))
    // subject.subscribe((result=>{
    //   console.log(result);
    // }))
    // subject.next(Math.random()*100)
  }


  getSlotsForDisplay(date: any) {
    const selectedDate = new Date(date.setHours(0, 0, 0, 0));
    this.slots_for_display = this.slots.filter((slot: any) => {
      const DateinSlot = new Date(slot.time);
      const midnightDateinSlot = new Date(DateinSlot.setHours(0, 0, 0, 0));
      return midnightDateinSlot.getTime() === selectedDate.getTime();
    });
  }

  getdoctorDetails(data: any) {
    this._userService.getdoctorDetails({ _id: data }).subscribe({
      next: (Response) => {
        this.doctor = Response;
      },
      error: (error) => {
        this._messageService.showErrorToastr(error.error.message)
      }
    });
  }

  getSlots(docId: any) {
    this._userService.getSlots({ _id: docId }).subscribe({
      next: (Response) => {
        this.slots = Response;
        if (this.slots.length > 0) {
          this.minDate = new Date(this.slots[0].time);
          this.maxDate = new Date(this.slots[this.slots.length - 1].time);
          this.date = new Date(); // Set the default date to today
          this.getSlotsForDisplay(this.date); // Display slots for today by default
        }
      },
      error: (error) => {
        this._messageService.showErrorToastr(error.error.message);
      }
    });
  }

  confirmSlot(slot: any) {
    this.selectedSlot = slot;
    this.showModal = true;
  }

  onConfirmSlot() {
    localStorage.setItem('slotId', this.selectedSlot._id);
    this._router.navigate(['/user/appoinment_booking']);
  }

  onCancelSlot() {
    console.log('Slot confirmation cancelled');
    this.showModal=false
  }

  slotBook(id: any) {
    this._userService.addSlot({ _id: id, docId: this.doctorId, userId: this.userId }).subscribe({
      next: (Response) => {
        this._messageService.showSuccessToastr('booking Confirmed.')
      }
    })
  }

  chat() {
    this._router.navigate(['/user/userchat'])
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }
}

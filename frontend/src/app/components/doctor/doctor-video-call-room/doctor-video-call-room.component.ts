import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { DoctorService } from 'src/app/services/doctor.service';
import { MessageToasterService } from 'src/app/services/message-toaster.service';

@Component({
  selector: 'app-doctor-video-call-room',
  templateUrl: './doctor-video-call-room.component.html',
  styleUrls: ['./doctor-video-call-room.component.css']
})
export class DoctorVideoCallRoomComponent implements OnInit,AfterViewInit{
  roomID!:any
  appointmentId!:any
  consultation_status='consulted'
  
  constructor(
    private _route:ActivatedRoute,
    private _doctorService:DoctorService,
    private _messageService:MessageToasterService,
    private _router:Router
  ){}

  @ViewChild('root')
  root!: ElementRef;

  ngOnInit(): void {
    this.appointmentId = this._route.snapshot.paramMap.get('appointmentId');
    this.roomID = this._route.snapshot.paramMap.get('id');
  }
  ngAfterViewInit(): void {
      // generate Kit Token
      const appID = 923607142;
      const serverSecret = "2f1971971760c464a9e09b6cb114a980";
      const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, this.roomID,  Date.now().toString(),  Date.now().toString());

      //generate link
      const videoCallLink = window.location.protocol + '//' + window.location.host + window.location.pathname + '?roomID=' + this.roomID;

      // Create instance object from Kit Token.
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      // Start a call.
      zp.joinRoom({
        container: this.root.nativeElement,
        sharedLinks: [
          {
            name: 'Personal link',
            url:videoCallLink,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
        },
      });
  }

  consultationStatus(){
    const status=this.consultation_status
    this._doctorService.update_consultationStatus({appointmentId:this.appointmentId,status:status}).subscribe({
      next:(Response)=>{
        this._messageService.showSuccessToastr('consultation status updated')
        if(status==='consulted'){
          this._router.navigate(['/doctor/add_prescription',this.appointmentId])
        }else{
          this._router.navigate(['/doctor/doctor_profile/next_appointment'])
        }
      },error:(error)=>{
        this._messageService.showErrorToastr(error.error.message)
      }
    })
  }
}


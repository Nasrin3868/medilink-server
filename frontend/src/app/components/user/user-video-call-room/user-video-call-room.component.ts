import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

@Component({
  selector: 'app-user-video-call-room',
  templateUrl: './user-video-call-room.component.html',
  styleUrls: ['./user-video-call-room.component.css']
})

export class UserVideoCallRoomComponent implements OnInit, AfterViewInit {
  roomID!: string
  constructor(
    private _route: ActivatedRoute,
  ) { }

  @ViewChild('root')
  root!: ElementRef;
  ngOnInit(): void {
    
    const room = this._route.snapshot.paramMap.get('id');
    room?this.roomID=room:this.roomID=''
    console.log('roomID is null, change the type of roomID to any. chnage the room to this.roomID:',this.roomID);
    
  }
  ngAfterViewInit(): void {
    // generate Kit Token
    const appID = 1774894683;
    const serverSecret = "d119d07ddaa7b419af6d6703e81a01b0";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, this.roomID, Date.now().toString(), Date.now().toString());
    // const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, this.roomID,  randomID(5),  randomID(5));

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
          url: videoCallLink,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
      },
    });
    // this.videoCallService.setVideoCallLink(videoCallLink,this.appointmentId)
  }
}

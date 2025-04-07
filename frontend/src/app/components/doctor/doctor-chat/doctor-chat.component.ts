import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { ChatService} from 'src/app/services/chat.service';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { SocketService } from 'src/app/services/socket.service';
import { io } from 'socket.io-client';
import { debounceTime, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChatService } from 'src/app/services/chat.service';
import { DoctorService } from 'src/app/services/doctor.service';
 
@Component({
  selector: 'app-doctor-chat',
  templateUrl: './doctor-chat.component.html',
  styleUrls: ['./doctor-chat.component.css']
})
export class DoctorChatComponent implements OnInit{

  private onMessageSubscription: Subscription | undefined;
  showScrollUpButton = false;
  socket!: any;
  senderId:any
  selectedDoctor!: any;
  profile_picture!:any;
  doctorDetails!:any;
  selectedChatMessages: any[] = [];
  lastSeen: string = '';
  @ViewChild('chatContainer')
  chatContainer!: ElementRef;
  doctorId!:any
  chatId!:any
  chats!:any
  messages!:any
  constructor(
    private _chatService:ChatService,
    private _messageService:MessageToasterService,
    private _formBuilder:FormBuilder,
    private _socketService:SocketService,
    private _doctorService:DoctorService
  ){
    this.socket = io(environment.api);
  }
  isSameDate(date1: string | Date, date2: string | Date): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  }
  ngOnInit(): void {
    this.doctorId=localStorage.getItem('doctorId')
      this._doctorService.getDoctorDetails({_id:this.doctorId}).subscribe({
        next:(Response)=>{
          this.doctorDetails=Response
        },
        error:(error)=>{
          // console.log('error while fetching doc details:',error.error.message);
          this._messageService.showErrorToastr(error.error.message)
        }
      })
    this.fetch_all_chats()
    if(this.chatId){
      this.socket.emit('joinChat', this.chatId);
    }
    this.scrollToBottom();
    this.messageSubscription()
    this.setupSearchSubscription()
  }

  //call if any message comes
  messageSubscription(){
    console.log("function get called...")
    this.onMessageSubscription = this._socketService.onMessage().subscribe((res:any)=>{
      if(res.chat===this.chatId){
        this.messages.unshift(res)
        this.chats.filter((chat: any)=>{
          if(chat._id===this.chatId){
            chat.latestMessage.content=res.content
            chat.updatedAt=res.updatedAt
          }
        })
      }
      this.senderId=res?.sender?._id
    });
  }
  searchForm=this._formBuilder.group({
    searchData:['',Validators.required]
  })

  setupSearchSubscription() {
    this.searchForm.get('searchData')?.valueChanges
      .pipe(debounceTime(300))
      .subscribe(value => {
          this.filterDoctors(value);
      });
  }
  chats_to_display!:any
  filterDoctors(searchTerm: string|null) {
    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      this.chats_to_display = this.chats.filter((chat:any) =>
        regex.test(`${chat.user.firstName} ${chat.user.lastName}`)
      );
      console.log('chats to disply:',this.chats_to_display,this.chats);
      
    } else {
      this.chats_to_display = this.chats;
    }
  }

  //fetching accessible chats
  fetch_all_chats(){
    this._chatService.doctor_accessed_chats({doctorId:this.doctorId}).subscribe({
      next:(Response)=>{
        console.log('fetched chats:',Response);
        this.chats=Response
        this.chats_to_display=Response
      }
    })
  }

  //call a particular user
  selectDoctor(chat: any): void {
    this._socketService.register(this.doctorId)
    this.chatId=chat._id
    this.fetchAllMessages(chat._id)
    this.selectedDoctor = `${chat.user.firstName} ${chat.user.lastName}`;
    this.profile_picture=chat.user.profile_picture
    this.lastSeen = chat.updatedAt
  }

  //fetch all messages of a particular chatID
  fetchAllMessages(chatId:any){
    this._chatService.doctorFetchAllMessages({chatId:chatId}).subscribe({
      next:(Response)=>{
        this.messages=Response
      },
      error:(error)=>{
        this._messageService.showErrorToastr(error.error.message)
      }
    })
  }

  //chatform
  chatForm=this._formBuilder.group({
    message:['',Validators.required]
  })

  //submission of chat form
  chatFormSubmit(){
    if(this.chatForm.valid){
      const message=this.chatForm.value.message
      if(message&&message.trim().length ===0){
        return
      }
      let data={
        content:message,
        chatId:this.chatId,
        doctorId:this.doctorId
      };
      this._chatService.doctorSendMessage(data).subscribe((data)=>{
        this._socketService.messageSendfromDoctor(data);
      });
        this.chatForm.reset()
    }
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  onScroll(event: { target: any; }): void {
    const element = event.target;
    this.showScrollUpButton = element.scrollTop + element.clientHeight < element.scrollHeight - 20;
  }

  scrollToTop(): void {
    try{
      this.chatContainer.nativeElement.scrollTop = 0;
    }catch(err) { }
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.onMessageSubscription?.unsubscribe();

  }

}

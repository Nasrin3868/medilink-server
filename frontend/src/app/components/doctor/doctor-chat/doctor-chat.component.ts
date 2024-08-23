import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { ChatService} from 'src/app/services/chat.service';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { SocketService } from 'src/app/services/socket.service';
import { io } from 'socket.io-client';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChatService } from 'src/app/services/chat.service';
 
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
  ){
    this.socket = io(environment.api);
  }

  ngOnInit(): void {
    this.doctorId=localStorage.getItem('doctorId')
    this.fetch_all_chats()
    if(this.chatId){
      this.socket.emit('joinChat', this.chatId);
    }
    this.scrollToBottom();
    this.messageSubscription()
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

  //fetching accessible chats
  fetch_all_chats(){
    this._chatService.doctor_accessed_chats({doctorId:this.doctorId}).subscribe({
      next:(Response)=>{
        console.log('fetched chats:',Response);
        this.chats=Response
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

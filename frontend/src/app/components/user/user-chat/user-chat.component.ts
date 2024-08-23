import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
// import { ChatService} from 'src/app/services/chat.service';

import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { SocketService } from 'src/app/services/socket.service';
import { io } from 'socket.io-client';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-user-chat',
  templateUrl: './user-chat.component.html',
  styleUrls: ['./user-chat.component.css']
})
export class UserChatComponent implements OnInit{
  
  private socketServiceSubscription: Subscription | undefined;
  socket!:any;

  showScrollUpButton = false;
  doctorId!:any
  userId!:any
  chats!:any
  messages!:any
  chatId!:any

  //specific chats
  selectedDoctor!: any;
  profile_picture!:any
  selectedChatMessages: any[] = [];
  lastSeen: string = '';
  
  @ViewChild('chatContainer')
  chatContainer!: ElementRef;

  constructor(
    private _formBuilder:FormBuilder,
    private _messageService:MessageToasterService,
    private _chatService:ChatService,
    private _socketService:SocketService
  ){
    this.socket = io(environment.api);
  }


  
  ngOnInit() {
    // this.doctorId = this.route.snapshot.paramMap.get('id');
    this.userId=localStorage.getItem('userId')
    this.accessedchat()
    this.scrollToBottom();
    this.socketServiceSubscription = this._socketService.onMessage().subscribe((res: any) => {
      if (res.chat === this.chatId) {
       console.log('newMEssage recieved in userside by socketIO:',res);
        this.messages.unshift(res);
        this.chats.filter((chat: any)=>{
          if(chat._id===this.chatId){
            chat.latestMessage.content=res.content
            chat.updatedAt=res.updatedAt
          }
        })
      }
    });
  }

  accessedchat(){
    this._chatService.accessChat({userId:this.userId}).subscribe({
      next:(Response)=>{
        this.userFetchAllChat();
      },error:(error)=>{
        this._messageService.showErrorToastr(error.error.message)
      }
    })
  }

  userFetchAllChat(){
    this._chatService.userFetchAllChat({userId:this.userId}).subscribe({
      next:(Response)=>{
        this.chats=Response
      },
      error:(error)=>{
        console.log('error:',error);
        this._messageService.showErrorToastr(error.error.message)
      }
    })
  }

  fetchAllMessages(chatId:any){
    this._chatService.userFetchAllMessages({chatId:chatId}).subscribe({
      next:(Response)=>{
        this.messages=Response
      },error:(error)=>{
        this._messageService.showErrorToastr(error.error.message)
      }
    })
  }

  selectDoctor(chat: any): void {
    this._socketService.register(this.userId)
    this.chatId=chat._id
    this.fetchAllMessages(this.chatId)
    this.selectedDoctor = `${chat.doctor.firstName} ${chat.doctor.lastName}`;
    this.profile_picture=chat.doctor.profile_picture
    this.selectedChatMessages = this.messages // Assuming `messages` is an array of messages for the selected chat
    this.lastSeen = chat.updatedAt
  }

  chatForm=this._formBuilder.group({
    message:['',Validators.required]
  })

  async chatFormSubmit(){
    if(this.chatForm.valid){
      const message=this.chatForm.value.message
      if(message&&message.trim().length ===0){
        return
      }
      console.log(message);
      let data = {
        content: message,
        chatId: this.chatId,
        userId: this.userId
      };
      this._chatService.sendMessage(data).subscribe((data) => {
        this._socketService.messageSendfromUser(data);
      });
      this.chatForm.reset()
    }
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }

  onScroll(event: { target: any; }): void {
    const element = event.target;
    this.showScrollUpButton = element.scrollTop + element.clientHeight < element.scrollHeight - 20;
  }

  scrollToTop(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = 0;
    } catch(err) { }
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }
    if (this.socketServiceSubscription) {
      this.socketServiceSubscription.unsubscribe();
    }
  }

}

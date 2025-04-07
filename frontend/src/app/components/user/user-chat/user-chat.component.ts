import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
// import { ChatService} from 'src/app/services/chat.service';
import {ChatAccessData} from 'src/app/store/model/usermodel'
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { SocketService } from 'src/app/services/socket.service';
import { io } from 'socket.io-client';
import { debounceTime, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChatService } from 'src/app/services/chat.service';
import { UserserviceService } from 'src/app/services/userservice.service';

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
  userDetails!:any

  //specific chats
  selectedDoctor!: any;
  profile_picture!:any
  selectedChatMessages: any[] = [];
  lastSeen: string = '';
  searchTerm: string = '';
  filteredChats: any[] = [];
  
  @ViewChild('chatContainer')
  chatContainer!: ElementRef;

  constructor(
    private _formBuilder:FormBuilder,
    private _messageService:MessageToasterService,
    private _chatService:ChatService,
    private _socketService:SocketService,
    private _userService:UserserviceService,
    private _showMessage:MessageToasterService
  ){
    this.socket = io(environment.api);
  }


  
  ngOnInit() {
    this.userId=localStorage.getItem('userId')
    this._userService.getuserDetails({userId:this.userId}).subscribe({
      next:(response)=>{
        this.userDetails=response
      },
      error:(error)=>{
        this._showMessage.showErrorToastr('Error in fetching user data')
      }
    })
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
    this.setupSearchSubscription()
  }
  isSameDate(date1: string | Date, date2: string | Date): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  }
  

  accessedchat(){
    const ChatAccessData :ChatAccessData={userId:this.userId}
    this._chatService.accessChat(ChatAccessData).subscribe({
      next:(Response)=>{
        this.userFetchAllChat();
      },error:(error)=>{
        this._messageService.showErrorToastr(error.error.message)
      }
    })
  }

  userFetchAllChat(){
    const ChatAccessData :ChatAccessData={userId:this.userId}
    this._chatService.userFetchAllChat(ChatAccessData).subscribe({
      next:(Response)=>{
        this.chats=Response
        this.chats_to_display=Response
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
        regex.test(`${chat.doctor.firstName} ${chat.doctor.lastName}`)
      );
      console.log('chats to disply:',this.chats_to_display,this.chats);
      
    } else {
      this.chats_to_display = this.chats;
    }
  }
  

  selectDoctor(chat: any): void {
    this._socketService.register(this.userId)
    this.chatId=chat._id
    this.fetchAllMessages(this.chatId)
    this.selectedDoctor = `${chat.doctor.firstName} ${chat.doctor.lastName}`;
    // this.selectDoctor=chat.doctor
    console.log(this.selectDoctor);
    this.profile_picture=chat.doctor.profile_picture
    this.selectedChatMessages = this.messages
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

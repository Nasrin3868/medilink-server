import { Component, OnInit } from '@angular/core';
import { AdminServiceService } from '../../services/admin-service.service';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
import { userdata } from '../../model/usermodel';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit{
  users!:userdata[]
  users_to_display!:userdata[]
  status='all'

  constructor(
    private _adminService:AdminServiceService,
    private _messageService:MessageToasterService,
    private _formBuilder:FormBuilder
  ){}

  ngOnInit(){
    this.getAllUsers()
    this.statusForm.get('status')?.valueChanges.subscribe(value => {
      console.log('Status changed to:', value);
      if(value) this.getAllUsers();
    });
  }

  searchForm=this._formBuilder.group({
    searchData:['',Validators.required]
  })

  setupSearchSubscription() {
    this.searchForm.get('searchData')?.valueChanges
      .pipe(debounceTime(300)) // Adjust debounce time as needed
      .subscribe(value => {
          this.filterDoctors(value);
      });
  }

  filterDoctors(searchTerm: string|null) {
    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      this.users_to_display = this.users_to_display.filter((users:any) =>
        regex.test(users.firstName)||
        regex.test(users.lastName)||
        regex.test(users.email)
      );
    } else {
      this.users_to_display = this.users;
    }
  }

  statusForm=this._formBuilder.group({
    status:['all']
  })

  statusFormSubmit(){
    if(this.statusForm.valid){
      const selectedStatus=this.statusForm.value.status
      if(selectedStatus){
        if(selectedStatus==='all'){
          this.users_to_display=this.users
        }else if(selectedStatus==='true'){
          this.users_to_display = this.users_to_display.filter((item: any) => 
              item.blocked==='true'
          );
        }else if(selectedStatus==='false'){
          this.users_to_display = this.users.filter((item:any) => 
            item.blocked==='false'
          );
        }
      }
    }
  }

  getAllUsers(){
    this._adminService.getUsers().subscribe({
      next:(Response)=>{
        this.users=Response
        this.users_to_display=this.users
      },
      error:(error)=>{
        this._messageService.showErrorToastr(error.message)
      }
    })
  }

  changeStatus(data:any){
    const queryparams={_id:data._id}
    this._adminService.userBlock(queryparams).subscribe({
      next:(Response)=>{
        //user blocked or unblocked
        data.blocked==='true'?data.blocked='false':data.blocked='true'
      },
      error:(error)=>{
        this._messageService.showErrorToastr(error.message)
      }
    })
  }
}

  import { Component, OnInit } from '@angular/core';
import { MessageToasterService } from 'src/app/services/message-toaster.service';
  import { UserserviceService } from 'src/app/services/userservice.service';
  import { UserModel } from 'src/app/store/model/commonModel';

  @Component({
    selector: 'app-wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.css']
  })
  export class WalletComponent implements OnInit{
    // NEW: State variable to track loading
  isLoading: boolean = true;
    constructor(
      private _userService:UserserviceService,
      private _showToast:MessageToasterService
    ){}

    wallet!:Number|undefined

    ngOnInit(): void {
      // Ensuring userId is available before the API call
      const userId = localStorage.getItem('userId');
      this.isLoading = true;
      if (userId) {
          this._userService.getuserDetails({userId: userId}).subscribe({
              next:(Response)=>{
                  this.wallet = Response.wallet;
                  this.isLoading = false;
              },
              error: (error) => {
                  // You might want to add error handling here, e.g., this.wallet = 0;
                console.error('Error fetching wallet balance:', error);
                this._showToast.showErrorToastr('Failed to fetch wallet balance.');
                this.isLoading = false;
              }
          });
      }else{
        this.isLoading = false;
      }
    }

  }

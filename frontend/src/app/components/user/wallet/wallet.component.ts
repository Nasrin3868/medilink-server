import { Component, OnInit } from '@angular/core';
import { UserserviceService } from 'src/app/services/userservice.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit{
  constructor(
    private _userService:UserserviceService,
  ){}

  wallet!:any

  ngOnInit(): void {
    this._userService.getuserDetails({userId:localStorage.getItem('userId')}).subscribe({
      next:(Response)=>{
        this.wallet=Response.wallet
      }
    })
  }

}

import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class MessageToasterService {

  constructor(private _toastr: ToastrService) { }

  // For showing the toastr message in succes senario
  showSuccessToastr(message: string) {
    return this._toastr.success(message, '', {
      timeOut: 5000,
      progressAnimation: 'increasing',
      progressBar: true
    })
  }

  // For showing the toastr message in warning senario
  showWarningToastr(message: string) {
    return this._toastr.warning(message, '', {
      timeOut: 5000,
      progressAnimation: 'increasing',
      progressBar: true,
    })
  }

  // For showing the toastr message in error senario
  showErrorToastr(message: string) {
    return this._toastr.error(message, '', {
      timeOut: 5000,
      progressAnimation: 'increasing',
      progressBar: true
    })
  }
}

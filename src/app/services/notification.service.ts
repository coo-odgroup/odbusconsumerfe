import { Injectable } from '@angular/core';
import {ToastrService} from 'ngx-toastr'

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  timeout:any='6000';

  constructor(private toastr: ToastrService) { }

  notify(message:any,type:any){

    if(type=='Error'){

      this.toastr.error(message, type, {
        timeOut: this.timeout,
        positionClass: 'toast-bottom-left'
      });

    }

    if(type=='Success'){

      this.toastr.success(message, type, {
        timeOut: this.timeout,
        positionClass: 'toast-bottom-left'
      });

    }

   

  }
}

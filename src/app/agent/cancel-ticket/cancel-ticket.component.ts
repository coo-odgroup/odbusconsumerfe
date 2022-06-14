import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { ApiclientcancelticketService } from '../../services/apiclientcancelticket.service';
import {Constants} from '../../constant/constant' ;
import { NotificationService } from '../../services/notification.service';
import { NgbDatepickerConfig,NgbModal,NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';






@Component({
  selector: 'app-cancel-ticket',
  templateUrl: './cancel-ticket.component.html',
  styleUrls: ['./cancel-ticket.component.scss'],
  providers: [NgbActiveModal]

})
export class CancelTicketComponent implements OnInit {

  public cancelForm: FormGroup;
  public FinalcancelForm: FormGroup;
  
  submitted = false;
  Otpsubmitted = false;

  bookingDetails:any;
  seats:any=[];
  totalseats:any=[];
  cancelInfo:any=[];
  ResendOtp :boolean=false;
  ResendTimer :boolean=true;
  Timer= 20;  
  alert:any='';
  cancelPnrDetails: any;

    
    constructor( public fb: FormBuilder,public router: Router,private spinner: NgxSpinnerService,private notify: NotificationService,public activeModal: NgbActiveModal,private modalService: NgbModal,public appclientTkt: ApiclientcancelticketService) { 

    this.cancelForm = this.fb.group({
      pnr: ['', Validators.required],
      // mobile: ['', [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]]
    });

  }


  getPnrDetails()
  {
    this.spinner.show();
    const data ={
      pnr:this.cancelForm.value.pnr,
      user_id:localStorage.getItem('USERID')
    }

    this.appclientTkt.getbookingdetails(data).subscribe(
      res=>{
        if (res.status == 1) {
          this.cancelPnrDetails = res.data;
          this.notify.addToast({ title: 'Success', msg: res.message, type: 'success' });
          this.spinner.hide();
        }
        else {
          this.notify.addToast({ title: 'Error', msg: res.message +" Or you may searching for a cancelled PNR", type: 'error' });
          this.cancelPnrDetails = "";
          this.spinner.hide();
        }
      }
    )
  }

  pnrCancel()
  {
    this.spinner.show();
    const data ={
      pnr:this.cancelForm.value.pnr,
      user_id:localStorage.getItem('USERID')
    }

    this.appclientTkt.pnrCancel(data).subscribe(
      resp=>{
        if (resp.status == 1) {
          this.notify.addToast({ title: 'Success', msg: resp.message, type: 'success' });
          this.cancelForm.reset();
          this.cancelPnrDetails = "";
          this.spinner.hide();
        }
        else {
          this.notify.addToast({ title: 'Error', msg: resp.message, type: 'error' });
          this.spinner.hide();
        }
      }
    )
  }



open(content:any) {
  this.modalService.open(content);
}

  ngOnInit(): void {
  }

}

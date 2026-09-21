import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrls: ['./new-page.component.css']
})
export class NewPageComponent implements OnInit {

  // customerName = 'SK TABRIZ ALLI';

  // pnrNumber = 'ODM21036588';

  // phone = '9937874390';

  // email = 'coo@odgroup.in';

  // copied = false;

  customerName: any;
  phone: any;
  email: any;
  isMobile: boolean;
  MenuActive: boolean = false;
  receipt_id: any;
  ticket_amount: any;
  pnrNumber: any;
  copied: any;


  constructor(private deviceService: DeviceDetectorService, private router: Router) {
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnInit(): void {
    this.customerName = localStorage.getItem('od_success_name');

    if (this.customerName == null) {
      this.router.navigate(['/']);
      return;
    }

    this.phone = localStorage.getItem('od_success_phone');
    this.email = localStorage.getItem('od_success_email');
    this.receipt_id = localStorage.getItem('receipt_id');
    this.pnrNumber = localStorage.getItem('pnr');
    this.ticket_amount = localStorage.getItem('ticket_amount');
  }

  viewTicket() {
    this.router.navigate(['/pnr/' + this.pnrNumber]);
  }

  continueToHomepage(): void {
    localStorage.removeItem('od_success_name');
    localStorage.removeItem('od_success_phone');
    localStorage.removeItem('od_success_email');
    localStorage.removeItem('receipt_id');
    localStorage.removeItem('pnr');
    localStorage.removeItem('ticket_amount');


    window.location.href = '/';
  }
}
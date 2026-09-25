import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import { BookticketService } from '../services/bookticket.service';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css'],
})
export class SuccessComponent implements OnInit {
  customerName: any;
  phone: any;
  email: any;
  isMobile: boolean;
  MenuActive: boolean = false;
  receipt_id: any;
  ticket_amount: any;
  pnrNumber: any;

  constructor(
    private deviceService: DeviceDetectorService,
    private router: Router,
    private bookingDataService: BookticketService
  ) {
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnInit(): void {
    const data = this.bookingDataService.getBookingData();
    this.customerName = data.name;
    // this.customerName = "sk sahil mohammed";

    if (this.customerName == null) {
      this.router.navigate(['/']);
      return;
    }

    this.phone = data.phone;
    this.email = data.email;
    this.receipt_id = data.receipt_id;
    this.pnrNumber = data.pnr;
    this.ticket_amount = data.ticket_amount;

    //will be off for testing
    this.pushPurchaseEvent();
  }
  viewTicket() {
    this.router.navigate(['/pnr/' + this.pnrNumber]);
  }

  continueToHomepage(): void {
    window.location.href = '/';
  }

  private pushPurchaseEvent(): void {

    const amount = Number(this.ticket_amount);

    if (!this.receipt_id || !amount || amount <= 0) {
      return;
    }

    const trackingKey = 'purchase_tracked_' + this.receipt_id;

    if (sessionStorage.getItem(trackingKey)) {
      return;
    }

    window.dataLayer = window.dataLayer || [];

    const purchaseEvent = {
      event: 'purchase',
      transaction_id: String(this.receipt_id),
      value: amount,
      currency: 'INR',
    };
    window.dataLayer.push(purchaseEvent);

    sessionStorage.setItem(trackingKey, '1');
  }
}

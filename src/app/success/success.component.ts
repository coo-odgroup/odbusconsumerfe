import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';

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
  name: any;
  phone: any;
  email: any;
  isMobile: boolean;
  MenuActive: boolean = false;
  receipt_id: any;
  ticket_amount: any;

  constructor(
    private deviceService: DeviceDetectorService,
    private router: Router,
  ) {
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnInit(): void {
    this.name = localStorage.getItem('od_success_name');

    if (this.name == null) {
      this.router.navigate(['/']);
      return;
    }

    this.phone = localStorage.getItem('od_success_phone');
    this.email = localStorage.getItem('od_success_email');
    this.receipt_id = localStorage.getItem('receipt_id');
    this.ticket_amount = localStorage.getItem('ticket_amount');

    //will be off for testing
    // this.pushPurchaseEvent();
  }

  // private pushPurchaseEvent(): void {

  //     const amount = Number(this.ticket_amount);

  //     // Don't fire if receipt or amount is missing/invalid
  //     if (!this.receipt_id || !amount || amount <= 0) {
  //       return;
  //     }

  //     // Prevent duplicate purchase event on page refresh
  //     const trackingKey = 'purchase_tracked_' + this.receipt_id;
  //     if (sessionStorage.getItem(trackingKey)) {
  //       return;
  //     }

  //     window.dataLayer = window.dataLayer || [];
  //     window.dataLayer.push({
  //       event: 'purchase',
  //       transaction_id: String(this.receipt_id),
  //       value: amount,
  //       currency: 'INR',
  //     });

  //     console.log('ODBUS PURCHASE DATALAYER:', {
  //       event: 'purchase',
  //       transaction_id: this.receipt_id,
  //       value: this.ticket_amount,
  //       currency: 'INR'
  //     });

  //     sessionStorage.setItem(trackingKey, '1');
  // }

  private pushPurchaseEvent(): void {
      console.log('=== ODBUS PURCHASE DEBUG ===');
      console.log('receipt_id:', this.receipt_id);
      console.log('ticket_amount:', this.ticket_amount);
      console.log('Number(ticket_amount):', Number(this.ticket_amount));

      const amount = Number(this.ticket_amount);

      if (!this.receipt_id || !amount || amount <= 0) {
        console.log('PURCHASE EVENT NOT FIRED');
        console.log('Reason:', {
          receipt_id_missing: !this.receipt_id,
          amount_invalid: !amount || amount <= 0,
        });
        return;
      }

      const trackingKey = 'purchase_tracked_' + this.receipt_id;

      console.log('trackingKey:', trackingKey);
      console.log('existing session value:', sessionStorage.getItem(trackingKey));

      if (sessionStorage.getItem(trackingKey)) {
        console.log('PURCHASE ALREADY TRACKED');
        return;
      }

      window.dataLayer = window.dataLayer || [];

      const purchaseEvent = {
        event: 'purchase',
        transaction_id: String(this.receipt_id),
        value: amount,
        currency: 'INR',
      };

      console.log('Pushing purchase event:', purchaseEvent);

      window.dataLayer.push(purchaseEvent);

      sessionStorage.setItem(trackingKey, '1');

      console.log('Session storage saved:', sessionStorage.getItem(trackingKey));

      console.log('ODBUS PURCHASE COMPLETE');
  }
}

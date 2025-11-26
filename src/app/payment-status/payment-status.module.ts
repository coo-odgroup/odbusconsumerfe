// src/app/payment-status/payment-status.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';

import { PaymentStatusComponent } from './payment-status.component';

@NgModule({
  declarations: [
    PaymentStatusComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    // configure a route so this module can be lazy-loaded OR navigated to directly
    RouterModule.forChild([
      { path: '', component: PaymentStatusComponent }
    ])
  ],
  exports: [
    PaymentStatusComponent
  ]
})
export class PaymentStatusModule { }

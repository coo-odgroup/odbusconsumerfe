import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RefundPolicyComponent } from './refund-policy.component';
import { RefundPolicyRoutingModule } from './refund-policy-routing.module';

@NgModule({
  declarations: [RefundPolicyComponent],
  imports: [CommonModule, RefundPolicyRoutingModule, SharedModule],
})
export class RefundPolicyModule {}

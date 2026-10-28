import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { OnlinebusticketsComponent } from './onlinebustickets.component';
import { OnlinebusticketsRoutingModule } from './onlinebustickets-routing.module';

@NgModule({
  declarations: [
    OnlinebusticketsComponent
  ],
  imports: [
    CommonModule,
    OnlinebusticketsRoutingModule,
    SharedModule
  ]
})
export class OnlinebusticketsModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PnrDetailsRoutingModule } from './pnrdetail-routing.module';
import { PnrdetailComponent } from './pnrdetail.component';



@NgModule({
  declarations: [
    PnrdetailComponent
  ],
  imports: [
    CommonModule,
    PnrDetailsRoutingModule,
    SharedModule
  ]
})
export class PnrDetailsModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TncRoutingModule } from './tnc-routing.module';
import { TncComponent } from './tnc.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    TncComponent
  ],
  imports: [
    CommonModule,
    TncRoutingModule,
    SharedModule
  ]
})
export class TncModule {}

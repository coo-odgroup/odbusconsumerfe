import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TncRoutingModule } from './tnc-routing.module';
import { TncComponent } from './tnc.component';

@NgModule({
  declarations: [
    TncComponent
  ],
  imports: [
    CommonModule,
    TncRoutingModule
  ]
})
export class TncModule {}

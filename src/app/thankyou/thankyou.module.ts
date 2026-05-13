import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThankyouRoutingModule } from './thankyou-routing.module';
import { ThankyouComponent } from './thankyou.component';


@NgModule({
  declarations: [
    ThankyouComponent
  ],
  imports: [
    CommonModule,
    ThankyouRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ThankyouModule { }

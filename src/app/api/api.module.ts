import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiRoutingModule } from './api-routing.module';
import { ApiComponent } from './api.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ApiComponent
  ],
  imports: [
    CommonModule,
    ApiRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ApiModule { }

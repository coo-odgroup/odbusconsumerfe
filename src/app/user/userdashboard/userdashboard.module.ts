import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserdashboardRoutingModule } from './userdashboard-routing.module';
import { UserdashboardComponent } from './userdashboard.component';
import { UserModule } from '../user.module';


@NgModule({
  declarations: [
    UserdashboardComponent
  ],
  imports: [
    CommonModule,
    UserdashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    UserModule
  ]
})
export class UserdashboardModule { }

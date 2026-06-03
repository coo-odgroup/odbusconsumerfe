import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserdashboardRoutingModule } from './userdashboard-routing.module';
import { UserdashboardComponent } from './userdashboard.component';
import { UserModule } from '../user.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    UserdashboardComponent
  ],
  imports: [
    CommonModule,
    UserdashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    UserModule,
    NgbModule
  ]
})
export class UserdashboardModule { }

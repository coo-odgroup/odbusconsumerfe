import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsernotificationRoutingModule } from './usernotifications-routing.module';
import { UsernotificationsComponent } from './usernotifications.component';
import { UsernavbarComponent } from '../usernavbar/usernavbar.component';
import { UserModule } from '../user.module';

@NgModule({
  declarations: [
    UsernotificationsComponent
  ],
  imports: [
    CommonModule,
    UsernotificationRoutingModule,
    UserModule
  ]
})
export class UsernotificationModule {}

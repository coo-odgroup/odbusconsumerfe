import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserModule } from '../user.module';
import { UserrewardsComponent } from './userrewards.component';
import { UserrewardsRoutingModule } from './userrewards-routing.module';

@NgModule({
  declarations: [
    UserrewardsComponent,
  ],
  imports: [
    CommonModule,
    UserrewardsRoutingModule,
    UserModule
  ]
})
export class UserrewardsModule {}

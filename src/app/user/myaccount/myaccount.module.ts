import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserModule } from '../user.module';
import { MyaccountComponent } from './myaccount.component';
import { MyaccountRoutingModule } from './myaccount-routing.module';

@NgModule({
  declarations: [
    MyaccountComponent,
  ],
  imports: [
    CommonModule,
    MyaccountRoutingModule,
    UserModule
  ]
})
export class MyaccountModule {}

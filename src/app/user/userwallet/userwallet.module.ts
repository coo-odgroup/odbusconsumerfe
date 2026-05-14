import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserwalletComponent } from './userwallet.component';
import { UserwalletRoutingModule } from './userwallet-routing.module';
import { UserModule } from '../user.module';

@NgModule({
  declarations: [
    UserwalletComponent,
  ],
  imports: [
    CommonModule,
    UserwalletRoutingModule,
    UserModule
  ]
})
export class UserwalletModule {}

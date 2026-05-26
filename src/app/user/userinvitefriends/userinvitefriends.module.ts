import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserModule } from '../user.module';
import { UserinvitefriendsRoutingModule } from './userinvitefriends-routing.module';
import { UserinvitefriendsComponent } from './userinvitefriends.component';

@NgModule({
  declarations: [
    UserinvitefriendsComponent,
  ],
  imports: [
    CommonModule,
    UserinvitefriendsRoutingModule,
    UserModule
  ]
})
export class UserinvitefriendsModule {}

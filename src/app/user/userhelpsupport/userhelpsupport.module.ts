import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserModule } from '../user.module';
import { UserhelpsupportComponent } from './userhelpsupport.component';
import { UserhelpsupportRoutingModule } from './userhelpsupport-routing.module';

@NgModule({
  declarations: [
    UserhelpsupportComponent,
  ],
  imports: [
    CommonModule,
    UserhelpsupportRoutingModule,
    UserModule
  ]
})
export class UserhelpsupportModule {}

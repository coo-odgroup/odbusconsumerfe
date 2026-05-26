import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsernavbarComponent } from './usernavbar/usernavbar.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [
    UsernavbarComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule
  ],
  exports: [
    UsernavbarComponent
  ]
})
export class UserModule {}

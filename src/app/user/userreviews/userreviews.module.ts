import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserModule } from '../user.module';
import { UserreviewsComponent } from './userreviews.component';
import { UserreviewsRoutingModule } from './userreviews-routing.module';

@NgModule({
  declarations: [
    UserreviewsComponent,
  ],
  imports: [
    CommonModule,
    UserreviewsRoutingModule,
    UserModule
  ]
})
export class UserreviewsModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserModule } from '../user.module';
import { MyaccountComponent } from './myaccount.component';
import { MyaccountRoutingModule } from './myaccount-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [
    MyaccountComponent,
  ],
  imports: [
    CommonModule,
    MyaccountRoutingModule,
    UserModule,
    ReactiveFormsModule,
    ImageCropperModule
  ]
})
export class MyaccountModule {}

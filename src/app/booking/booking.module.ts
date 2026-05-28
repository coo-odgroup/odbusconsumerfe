import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BookingComponent } from './booking.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [BrowserModule, FormsModule, SharedModule],
  bootstrap: [BookingComponent],
  declarations: [
    // BookingComponent
  ],
})
export class BookingModule {}

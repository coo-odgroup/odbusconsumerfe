import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

import { SearchBoxComponent } from '../search-box/search-box.component';
import { SearchBoxMComponent } from '../search-box-m/search-box-m.component';

@NgModule({
  declarations: [
    SearchBoxComponent,
    SearchBoxMComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTypeaheadModule
  ],
  exports: [
    SearchBoxComponent,
    SearchBoxMComponent,
  ]
})
export class SharedModule {}
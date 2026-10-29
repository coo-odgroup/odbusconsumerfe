import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

import { SearchBoxComponent } from '../search-box/search-box.component';
import { SearchBoxMComponent } from '../search-box-m/search-box-m.component';
import { FooterMenuComponent } from '../footer-menu/footer-menu.component';

@NgModule({
  declarations: [
    SearchBoxComponent,
    SearchBoxMComponent,
    FooterMenuComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbTypeaheadModule
  ],
  exports: [
    SearchBoxComponent,
    SearchBoxMComponent,
    FooterMenuComponent
  ]
})
export class SharedModule {}
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterMenuComponent } from '../footer-menu/footer-menu.component';

@NgModule({
  declarations: [
    FooterMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    FooterMenuComponent
  ]
})
export class SharedModule { }

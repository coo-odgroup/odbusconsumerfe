import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqRoutingModule } from './faq-routing.module';
import { FaqComponent } from './faq.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    FaqComponent
  ],
  imports: [
    CommonModule,
    FaqRoutingModule,
    NgbAccordionModule,
    NgxSpinnerModule
  ]
})
export class FaqModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CareersRoutingModule } from './careers-routing.module';
import { CareersComponent } from './careers.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    CareersComponent
  ],
  imports: [
    CommonModule,
    CareersRoutingModule,
    NgbAccordionModule,
    SharedModule
  ]
})
export class CareersModule {}

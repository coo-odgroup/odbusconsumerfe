import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperatorsRoutingModule } from './operators-routing.module';
import { OperatorsComponent } from './operators.component';
import { OperatorDetailComponent } from '../operator-detail/operator-detail.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    OperatorsComponent,
    OperatorDetailComponent
  ],
  imports: [
    CommonModule,
    OperatorsRoutingModule,
    NgbDatepickerModule,
    SharedModule,
    FormsModule
  ]
})
export class OperatorsModule {}

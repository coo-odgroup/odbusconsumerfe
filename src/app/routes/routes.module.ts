import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutesRoutingModule } from './routes-routing.module';
import { RoutesComponent } from './routes.component';
import { FilterPipe } from '../filter.pipe';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  declarations: [
    RoutesComponent,
    FilterPipe
  ],
  imports: [
    CommonModule,
    RoutesRoutingModule,
    NgbDatepickerModule,
    FormsModule,
    SharedModule
  ]
})

export class RoutesModule {}

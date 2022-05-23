import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DatewiserouteComponent} from './datewiseroute.component';

const routes: Routes = [
  {
    path: '',
    component: DatewiserouteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DatewiserouteRoutingModule { }

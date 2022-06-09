import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ClientissueComponent} from './clientissue.component';

const routes: Routes = [
  {
    path: '',
    component: ClientissueComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientissueRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnlinebusticketsComponent } from './onlinebustickets.component';

const routes: Routes = [
  {
    path: '',
    component: OnlinebusticketsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnlinebusticketsRoutingModule {}

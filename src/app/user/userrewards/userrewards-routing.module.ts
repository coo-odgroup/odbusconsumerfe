import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserrewardsComponent } from './userrewards.component';

const routes: Routes = [
  {
    path: '',
    component: UserrewardsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserrewardsRoutingModule {}
    
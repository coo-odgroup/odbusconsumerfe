import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserreviewsComponent } from './userreviews.component';

const routes: Routes = [
  {
    path: '',
    component: UserreviewsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserreviewsRoutingModule {}
    
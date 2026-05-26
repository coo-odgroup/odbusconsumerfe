import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserhelpsupportComponent } from './userhelpsupport.component';

const routes: Routes = [
  {
    path: '',
    component: UserhelpsupportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserhelpsupportRoutingModule {}
    
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsernotificationsComponent } from './usernotifications.component';

const routes: Routes = [
  {
    path: '',
    component: UsernotificationsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsernotificationRoutingModule {}
    
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserinvitefriendsComponent } from './userinvitefriends.component';

const routes: Routes = [
  {
    path: '',
    component: UserinvitefriendsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserinvitefriendsRoutingModule {}
    
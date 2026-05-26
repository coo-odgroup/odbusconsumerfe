import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserwalletComponent } from './userwallet.component';

const routes: Routes = [
  {
    path: '',
    component: UserwalletComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserwalletRoutingModule {}
    
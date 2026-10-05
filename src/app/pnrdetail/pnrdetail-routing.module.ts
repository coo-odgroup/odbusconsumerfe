import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PnrdetailComponent } from './pnrdetail.component';


const routes: Routes = [
  {
    path: '',
    component: PnrdetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PnrDetailsRoutingModule {}

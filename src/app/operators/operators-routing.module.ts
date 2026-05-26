import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperatorsComponent } from './operators.component';
import { OperatorDetailComponent } from '../operator-detail/operator-detail.component';

const routes: Routes = [

  {
    path: '',
    component: OperatorsComponent
  },

  {
    path: ':url',
    component: OperatorDetailComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperatorsRoutingModule {}

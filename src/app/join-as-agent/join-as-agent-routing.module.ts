import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JoinAsAgentComponent } from './join-as-agent.component';

const routes: Routes = [
  {
    path: '',
    component: JoinAsAgentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JoinAsAgentRoutingModule {}

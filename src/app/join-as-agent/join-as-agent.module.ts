import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { JoinAsAgentComponent } from './join-as-agent.component';
import { JoinAsAgentRoutingModule } from './join-as-agent-routing.module';

@NgModule({
  declarations: [JoinAsAgentComponent],
  imports: [CommonModule, JoinAsAgentRoutingModule, SharedModule],
})
export class JoinAsAgentModule {}

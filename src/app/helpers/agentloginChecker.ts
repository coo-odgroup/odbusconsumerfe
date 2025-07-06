import { Injectable } from '@angular/core';
@Injectable()

export class AgentLoginChecker {
  isAgentLoggedIn(): boolean{
    return localStorage.getItem('agentData') == null ? false : true;
  }
    setLoggedInAgent(user: any): void {
        localStorage.setItem('agentData', user);
    }
    AgentLogout(){
        localStorage.removeItem('agentData');
    }
    getAgent(){
      
        const userdata= JSON.parse(localStorage.getItem('agentData'));
        return userdata;
    }

}
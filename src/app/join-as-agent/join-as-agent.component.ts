import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-join-as-agent',
  templateUrl: './join-as-agent.component.html',
  styleUrls: ['./join-as-agent.component.css']
})
export class JoinAsAgentComponent implements OnInit, OnDestroy {

  constructor() { }

  private scriptId = 'tailwind-cdn';

  ngOnInit(): void {
    if (!document.getElementById(this.scriptId)) {
      const script = document.createElement('script');
      script.id = this.scriptId;
      script.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(script);
    }
  }

  ngOnDestroy(): void {
    const script = document.getElementById(this.scriptId);
    if (script) {
      script.remove();
    }
  }

}

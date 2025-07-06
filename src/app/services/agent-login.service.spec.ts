import { TestBed } from '@angular/core/testing';

import { AgentLoginService } from './agent-login.service';

describe('AgentLoginService', () => {
  let service: AgentLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

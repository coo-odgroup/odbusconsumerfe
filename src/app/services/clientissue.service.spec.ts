import { TestBed } from '@angular/core/testing';

import { ClientissueService } from './clientissue.service';

describe('ClientissueService', () => {
  let service: ClientissueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientissueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

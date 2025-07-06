import { TestBed } from '@angular/core/testing';

import { ApireferenceService } from './apireference.service';

describe('ApireferenceService', () => {
  let service: ApireferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApireferenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

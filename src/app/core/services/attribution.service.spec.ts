import { TestBed } from '@angular/core/testing';

import { AttributionService } from './attribution.service';

describe('AttributionService', () => {
  let service: AttributionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttributionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

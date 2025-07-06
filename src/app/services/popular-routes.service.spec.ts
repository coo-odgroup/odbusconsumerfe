import { TestBed } from '@angular/core/testing';

import { PopularRoutesService } from './popular-routes.service';

describe('PopularRoutesService', () => {
  let service: PopularRoutesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopularRoutesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

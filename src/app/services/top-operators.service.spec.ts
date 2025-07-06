import { TestBed } from '@angular/core/testing';

import { TopOperatorsService } from './top-operators.service';

describe('TopOperatorsService', () => {
  let service: TopOperatorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopOperatorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

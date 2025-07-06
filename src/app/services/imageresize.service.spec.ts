import { TestBed } from '@angular/core/testing';

import { ImageresizeService } from './imageresize.service';

describe('ImageresizeService', () => {
  let service: ImageresizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageresizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

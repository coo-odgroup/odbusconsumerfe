import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PnrdetailComponent } from './pnrdetail.component';

describe('PnrdetailComponent', () => {
  let component: PnrdetailComponent;
  let fixture: ComponentFixture<PnrdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PnrdetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PnrdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

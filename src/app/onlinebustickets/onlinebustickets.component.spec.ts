import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlinebusticketsComponent } from './onlinebustickets.component';

describe('OnlinebusticketsComponent', () => {
  let component: OnlinebusticketsComponent;
  let fixture: ComponentFixture<OnlinebusticketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlinebusticketsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlinebusticketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

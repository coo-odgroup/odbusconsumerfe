import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatewiserouteComponent } from './datewiseroute.component';

describe('DatewiserouteComponent', () => {
  let component: DatewiserouteComponent;
  let fixture: ComponentFixture<DatewiserouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatewiserouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatewiserouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

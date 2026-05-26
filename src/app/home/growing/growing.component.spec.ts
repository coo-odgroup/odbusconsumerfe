import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowingComponent } from './growing.component';

describe('GrowingComponent', () => {
  let component: GrowingComponent;
  let fixture: ComponentFixture<GrowingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrowingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrowingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

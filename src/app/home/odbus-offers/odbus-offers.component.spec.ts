import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdbusOffersComponent } from './odbus-offers.component';

describe('OdbusOffersComponent', () => {
  let component: OdbusOffersComponent;
  let fixture: ComponentFixture<OdbusOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OdbusOffersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OdbusOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

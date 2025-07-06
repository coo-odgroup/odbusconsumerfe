import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserrewardsComponent } from './userrewards.component';

describe('UserrewardsComponent', () => {
  let component: UserrewardsComponent;
  let fixture: ComponentFixture<UserrewardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserrewardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserrewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

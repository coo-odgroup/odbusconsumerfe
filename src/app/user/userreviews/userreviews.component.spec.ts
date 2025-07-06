import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserreviewsComponent } from './userreviews.component';

describe('UserreviewsComponent', () => {
  let component: UserreviewsComponent;
  let fixture: ComponentFixture<UserreviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserreviewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserreviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

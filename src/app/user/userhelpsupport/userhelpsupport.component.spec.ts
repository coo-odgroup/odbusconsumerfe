import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserhelpsupportComponent } from './userhelpsupport.component';

describe('UserhelpsupportComponent', () => {
  let component: UserhelpsupportComponent;
  let fixture: ComponentFixture<UserhelpsupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserhelpsupportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserhelpsupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

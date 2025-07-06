import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfiledeleteComponent } from './profiledelete.component';

describe('ProfiledeleteComponent', () => {
  let component: ProfiledeleteComponent;
  let fixture: ComponentFixture<ProfiledeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfiledeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfiledeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

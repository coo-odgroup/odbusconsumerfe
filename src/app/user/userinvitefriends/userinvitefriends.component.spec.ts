import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserinvitefriendsComponent } from './userinvitefriends.component';

describe('UserinvitefriendsComponent', () => {
  let component: UserinvitefriendsComponent;
  let fixture: ComponentFixture<UserinvitefriendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserinvitefriendsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserinvitefriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLoginPageComponent } from './new-login-page.component';

describe('NewLoginPageComponent', () => {
  let component: NewLoginPageComponent;
  let fixture: ComponentFixture<NewLoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewLoginPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

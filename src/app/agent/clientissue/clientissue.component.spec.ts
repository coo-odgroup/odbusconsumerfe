import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientissueComponent } from './clientissue.component';

describe('ClientissueComponent', () => {
  let component: ClientissueComponent;
  let fixture: ComponentFixture<ClientissueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientissueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientissueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

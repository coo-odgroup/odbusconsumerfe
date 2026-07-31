import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinAsAgentComponent } from './join-as-agent.component';

describe('JoinAsAgentComponent', () => {
  let component: JoinAsAgentComponent;
  let fixture: ComponentFixture<JoinAsAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinAsAgentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinAsAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

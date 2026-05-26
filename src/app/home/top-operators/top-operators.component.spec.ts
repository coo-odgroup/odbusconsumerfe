import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopOperatorsComponent } from './top-operators.component';

describe('TopOperatorsComponent', () => {
  let component: TopOperatorsComponent;
  let fixture: ComponentFixture<TopOperatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopOperatorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopOperatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBoxMComponent } from './search-box-m.component';

describe('SearchBoxMComponent', () => {
  let component: SearchBoxMComponent;
  let fixture: ComponentFixture<SearchBoxMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchBoxMComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBoxMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

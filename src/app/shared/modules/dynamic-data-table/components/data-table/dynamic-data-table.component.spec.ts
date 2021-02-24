import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicDataTableComponent } from './dynamic-data-table.component';

describe('DynamicDataTableComponent', () => {
  let component: DynamicDataTableComponent;
  let fixture: ComponentFixture<DynamicDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

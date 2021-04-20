import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetFilterComponent } from './timesheet-filter.component';

describe('TimesheetFilterComponent', () => {
  let component: TimesheetFilterComponent;
  let fixture: ComponentFixture<TimesheetFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimesheetFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

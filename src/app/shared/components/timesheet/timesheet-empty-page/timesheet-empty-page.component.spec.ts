import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetEmptyPageComponent } from './timesheet-empty-page.component';

describe('TimesheetEmptyPageComponent', () => {
  let component: TimesheetEmptyPageComponent;
  let fixture: ComponentFixture<TimesheetEmptyPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimesheetEmptyPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetEmptyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectTimesheetComponent } from './reject-timesheet.component';

describe('RejectTimesheetComponent', () => {
  let component: RejectTimesheetComponent;
  let fixture: ComponentFixture<RejectTimesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectTimesheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowTimesheetComponent } from './show-timesheet.component';

describe('ShowTimesheetComponent', () => {
  let component: ShowTimesheetComponent;
  let fixture: ComponentFixture<ShowTimesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowTimesheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

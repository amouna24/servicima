import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyPageTimesheetComponent } from './empty-page-timesheet.component';

describe('EmptyPageTimesheetComponent', () => {
  let component: EmptyPageTimesheetComponent;
  let fixture: ComponentFixture<EmptyPageTimesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmptyPageTimesheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyPageTimesheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

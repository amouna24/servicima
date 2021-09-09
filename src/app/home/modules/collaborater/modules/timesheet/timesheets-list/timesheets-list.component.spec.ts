import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetsListComponent } from './timesheets-list.component';

describe('TimesheetsListComponent', () => {
  let component: TimesheetsListComponent;
  let fixture: ComponentFixture<TimesheetsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimesheetsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

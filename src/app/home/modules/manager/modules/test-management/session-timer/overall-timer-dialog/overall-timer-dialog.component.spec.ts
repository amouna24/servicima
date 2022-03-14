import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallTimerDialogComponent } from './overall-timer-dialog.component';

describe('OverallTimerDialogComponent', () => {
  let component: OverallTimerDialogComponent;
  let fixture: ComponentFixture<OverallTimerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverallTimerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverallTimerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

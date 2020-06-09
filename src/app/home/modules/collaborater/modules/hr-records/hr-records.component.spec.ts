import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrRecordsComponent } from './hr-records.component';

describe('HrRecordsComponent', () => {
  let component: HrRecordsComponent;
  let fixture: ComponentFixture<HrRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

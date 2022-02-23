import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertRequiredDataComponent } from './alert-required-data.component';

describe('AlertRequiredDataComponent', () => {
  let component: AlertRequiredDataComponent;
  let fixture: ComponentFixture<AlertRequiredDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertRequiredDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertRequiredDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

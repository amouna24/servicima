import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingAvailableListComponent } from './training-available-list.component';

describe('TrainingAvailableListComponent', () => {
  let component: TrainingAvailableListComponent;
  let fixture: ComponentFixture<TrainingAvailableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingAvailableListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingAvailableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

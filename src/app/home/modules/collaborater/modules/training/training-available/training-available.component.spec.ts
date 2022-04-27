import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingAvailableComponent } from './training-available.component';

describe('TrainingAvailableComponent', () => {
  let component: TrainingAvailableComponent;
  let fixture: ComponentFixture<TrainingAvailableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingAvailableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

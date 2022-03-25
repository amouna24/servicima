import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingDoneCreatedComponent } from './training-done-created.component';

describe('TrainingDoneCreatedComponent', () => {
  let component: TrainingDoneCreatedComponent;
  let fixture: ComponentFixture<TrainingDoneCreatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingDoneCreatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingDoneCreatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingRequestCollaboratorComponent } from './training-request-collaborator.component';

describe('TrainingRequestCollaboratorComponent', () => {
  let component: TrainingRequestCollaboratorComponent;
  let fixture: ComponentFixture<TrainingRequestCollaboratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingRequestCollaboratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingRequestCollaboratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

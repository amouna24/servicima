import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRequestTrainingComponent } from './add-request-training.component';

describe('AddRequestTrainingComponent', () => {
  let component: AddRequestTrainingComponent;
  let fixture: ComponentFixture<AddRequestTrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRequestTrainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRequestTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

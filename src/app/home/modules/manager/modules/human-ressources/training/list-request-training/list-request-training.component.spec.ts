import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRequestTrainingComponent } from './list-request-training.component';

describe('ListRequestTrainingComponent', () => {
  let component: ListRequestTrainingComponent;
  let fixture: ComponentFixture<ListRequestTrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRequestTrainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRequestTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

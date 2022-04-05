import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsTrainingComponent } from './sessions-training.component';

describe('SessionsTrainingComponent', () => {
  let component: SessionsTrainingComponent;
  let fixture: ComponentFixture<SessionsTrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionsTrainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionsTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

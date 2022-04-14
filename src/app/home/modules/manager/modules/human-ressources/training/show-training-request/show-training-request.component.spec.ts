import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowTrainingRequestComponent } from './show-training-request.component';

describe('ShowTrainingRequestComponent', () => {
  let component: ShowTrainingRequestComponent;
  let fixture: ComponentFixture<ShowTrainingRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowTrainingRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowTrainingRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

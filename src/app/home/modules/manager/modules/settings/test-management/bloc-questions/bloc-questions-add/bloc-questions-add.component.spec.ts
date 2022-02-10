import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocQuestionsAddComponent } from './bloc-questions-add.component';

describe('BlocQuestionsAddComponent', () => {
  let component: BlocQuestionsAddComponent;
  let fixture: ComponentFixture<BlocQuestionsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlocQuestionsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlocQuestionsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocQuestionsDetailsComponent } from './bloc-questions-details.component';

describe('BlocQuestionsDetailsComponent', () => {
  let component: BlocQuestionsDetailsComponent;
  let fixture: ComponentFixture<BlocQuestionsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlocQuestionsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlocQuestionsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

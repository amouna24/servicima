import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocQuestionsListComponent } from './bloc-questions-list.component';

describe('BlocQuestionsListComponent', () => {
  let component: BlocQuestionsListComponent;
  let fixture: ComponentFixture<BlocQuestionsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlocQuestionsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlocQuestionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

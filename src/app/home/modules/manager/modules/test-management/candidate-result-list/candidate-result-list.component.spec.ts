import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateResultListComponent } from './candidate-result-list.component';

describe('CandidateResultListComponent', () => {
  let component: CandidateResultListComponent;
  let fixture: ComponentFixture<CandidateResultListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateResultListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateResultListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeInterventionComponent } from './resume-intervention.component';

describe('ResumeInterventionComponent', () => {
  let component: ResumeInterventionComponent;
  let fixture: ComponentFixture<ResumeInterventionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumeInterventionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeInterventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

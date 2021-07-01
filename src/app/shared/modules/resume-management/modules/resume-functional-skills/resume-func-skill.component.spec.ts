import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeFuncSkillComponent } from './resume-func-skill.component';

describe('ResumeFuncSkillComponent', () => {
  let component: ResumeFuncSkillComponent;
  let fixture: ComponentFixture<ResumeFuncSkillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumeFuncSkillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeFuncSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

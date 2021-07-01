import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeTechSkillComponent } from './resume-tech-skill.component';

describe('ResumeTechSkillComponent', () => {
  let component: ResumeTechSkillComponent;
  let fixture: ComponentFixture<ResumeTechSkillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumeTechSkillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeTechSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeThemeComponent } from './resume-theme.component';

describe('ResumeThemeComponent', () => {
  let component: ResumeThemeComponent;
  let fixture: ComponentFixture<ResumeThemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumeThemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

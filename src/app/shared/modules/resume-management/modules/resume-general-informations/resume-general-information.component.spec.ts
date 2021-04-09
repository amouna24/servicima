import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeGeneralInformationComponent } from './resume-general-information.component';

describe('ResumeGeneralInformationComponent', () => {
  let component: ResumeGeneralInformationComponent;
  let fixture: ComponentFixture<ResumeGeneralInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumeGeneralInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeGeneralInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeCertificationsComponent } from './resume-certifications.component';

describe('ResumeCertficationsComponent', () => {
  let component: ResumeCertificationsComponent;
  let fixture: ComponentFixture<ResumeCertificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumeCertificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeCertificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

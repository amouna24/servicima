import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeCertifDiplomaComponent } from './resume-certif-diploma.component';

describe('ResumeCertifDiplomaComponent', () => {
  let component: ResumeCertifDiplomaComponent;
  let fixture: ComponentFixture<ResumeCertifDiplomaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumeCertifDiplomaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeCertifDiplomaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

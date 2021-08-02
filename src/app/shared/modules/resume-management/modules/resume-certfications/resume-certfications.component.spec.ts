import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeCertficationsComponent } from './resume-certfications.component';

describe('ResumeCertficationsComponent', () => {
  let component: ResumeCertficationsComponent;
  let fixture: ComponentFixture<ResumeCertficationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumeCertficationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeCertficationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

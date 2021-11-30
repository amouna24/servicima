import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestWorkCertificateComponent } from './request-work-certificate.component';

describe('RequestWorkCertificateComponent', () => {
  let component: RequestWorkCertificateComponent;
  let fixture: ComponentFixture<RequestWorkCertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestWorkCertificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestWorkCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

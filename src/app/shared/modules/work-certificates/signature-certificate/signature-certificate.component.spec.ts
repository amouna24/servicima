import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureCertificateComponent } from './signature-certificate.component';

describe('SignatureCertificateComponent', () => {
  let component: SignatureCertificateComponent;
  let fixture: ComponentFixture<SignatureCertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignatureCertificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

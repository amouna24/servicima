import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpatriationCertificatesComponent } from './expatriation-certificates.component';

describe('ExpatriationCertificatesComponent', () => {
  let component: ExpatriationCertificatesComponent;
  let fixture: ComponentFixture<ExpatriationCertificatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpatriationCertificatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpatriationCertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

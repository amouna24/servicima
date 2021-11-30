import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowWorkCertificateComponent } from './show-work-certificate.component';

describe('ShowWorkCertificateComponent', () => {
  let component: ShowWorkCertificateComponent;
  let fixture: ComponentFixture<ShowWorkCertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowWorkCertificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowWorkCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

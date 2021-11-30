import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWorkCertificateComponent } from './edit-work-certificate.component';

describe('EditWorkCertificateComponent', () => {
  let component: EditWorkCertificateComponent;
  let fixture: ComponentFixture<EditWorkCertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditWorkCertificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWorkCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

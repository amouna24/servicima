import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkCertificatesComponent } from './work-certificates.component';

describe('WorkCertificatesComponent', () => {
  let component: WorkCertificatesComponent;
  let fixture: ComponentFixture<WorkCertificatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkCertificatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkCertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

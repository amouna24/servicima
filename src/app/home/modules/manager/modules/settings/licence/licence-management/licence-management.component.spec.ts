import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenceManagementComponent } from './licence-management.component';

describe('LicenceManagementComponent', () => {
  let component: LicenceManagementComponent;
  let fixture: ComponentFixture<LicenceManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenceManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayslipImportComponent } from './payslip-import.component';

describe('PayslipImportComponent', () => {
  let component: PayslipImportComponent;
  let fixture: ComponentFixture<PayslipImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayslipImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayslipImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

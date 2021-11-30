import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePwdInvoiceComponent } from './change-pwd-invoice.component';

describe('ChangePwdInvoiceComponent', () => {
  let component: ChangePwdInvoiceComponent;
  let fixture: ComponentFixture<ChangePwdInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePwdInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePwdInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

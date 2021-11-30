import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPwdInvoiceComponent } from './set-pwd-invoice.component';

describe('SetPwdInvoiceComponent', () => {
  let component: SetPwdInvoiceComponent;
  let fixture: ComponentFixture<SetPwdInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetPwdInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPwdInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

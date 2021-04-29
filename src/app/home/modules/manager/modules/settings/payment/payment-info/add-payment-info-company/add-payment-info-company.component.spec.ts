import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaymentInfoCompanyComponent } from './add-payment-info-company.component';

describe('AddPaymentInfoCompanyComponent', () => {
  let component: AddPaymentInfoCompanyComponent;
  let fixture: ComponentFixture<AddPaymentInfoCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPaymentInfoCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPaymentInfoCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

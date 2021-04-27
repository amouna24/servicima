import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodsManagementComponent } from './payment-methods-management.component';

describe('PaymentMethodsManagementComponent', () => {
  let component: PaymentMethodsManagementComponent;
  let fixture: ComponentFixture<PaymentMethodsManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentMethodsManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentMethodsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

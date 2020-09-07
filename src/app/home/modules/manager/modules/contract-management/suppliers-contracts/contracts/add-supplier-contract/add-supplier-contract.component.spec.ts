import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSupplierContractComponent } from './add-supplier-contract.component';

describe('AddSupplierContractComponent', () => {
  let component: AddSupplierContractComponent;
  let fixture: ComponentFixture<AddSupplierContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSupplierContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSupplierContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

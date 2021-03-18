import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaxCompanyComponent } from './add-tax-company.component';

describe('AddTaxCompanyComponent', () => {
  let component: AddTaxCompanyComponent;
  let fixture: ComponentFixture<AddTaxCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTaxCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTaxCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

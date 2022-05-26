import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBankStatementComponent } from './add-bank-statement.component';

describe('BankStatementComponent', () => {
  let component: AddBankStatementComponent;
  let fixture: ComponentFixture<AddBankStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBankStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBankStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

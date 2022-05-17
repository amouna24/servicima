import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseRecurringComponent } from './expense-recurring.component';

describe('ExpenseRecurringComponent', () => {
  let component: ExpenseRecurringComponent;
  let fixture: ComponentFixture<ExpenseRecurringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseRecurringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseRecurringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

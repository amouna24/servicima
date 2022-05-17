import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseRecurringListComponent } from './expense-recurring-list.component';

describe('ExpenseRecurringListComponent', () => {
  let component: ExpenseRecurringListComponent;
  let fixture: ComponentFixture<ExpenseRecurringListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseRecurringListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseRecurringListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

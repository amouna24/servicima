import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseNormalComponent } from './expense-normal.component';

describe('ExpenseNormalComponent', () => {
  let component: ExpenseNormalComponent;
  let fixture: ComponentFixture<ExpenseNormalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseNormalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseNormalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

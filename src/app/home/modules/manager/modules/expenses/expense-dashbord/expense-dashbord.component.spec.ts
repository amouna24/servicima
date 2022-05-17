import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseDashbordComponent } from './expense-dashbord.component';

describe('ExpenseDashbordComponent', () => {
  let component: ExpenseDashbordComponent;
  let fixture: ComponentFixture<ExpenseDashbordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseDashbordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseDashbordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

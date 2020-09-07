import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliersContractsListComponent } from './suppliers-contracts-list.component';

describe('SuppliersContractsListComponent', () => {
  let component: SuppliersContractsListComponent;
  let fixture: ComponentFixture<SuppliersContractsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuppliersContractsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuppliersContractsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

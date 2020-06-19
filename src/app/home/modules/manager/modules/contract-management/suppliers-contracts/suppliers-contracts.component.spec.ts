import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliersContractsComponent } from './suppliers-contracts.component';

describe('SuppliersContractsComponent', () => {
  let component: SuppliersContractsComponent;
  let fixture: ComponentFixture<SuppliersContractsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuppliersContractsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuppliersContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

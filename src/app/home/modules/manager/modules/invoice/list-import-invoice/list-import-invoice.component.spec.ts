import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListImportInvoiceComponent } from './list-import-invoice.component';

describe('ListImportInvoiceComponent', () => {
  let component: ListImportInvoiceComponent;
  let fixture: ComponentFixture<ListImportInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListImportInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListImportInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

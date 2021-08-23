import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyBankingInfoComponent } from './company-banking-info.component';

describe('CompanyBankingInfoComponent', () => {
  let component: CompanyBankingInfoComponent;
  let fixture: ComponentFixture<CompanyBankingInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyBankingInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyBankingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

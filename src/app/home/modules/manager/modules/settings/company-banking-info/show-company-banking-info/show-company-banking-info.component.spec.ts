import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCompanyBankingInfoComponent } from './show-company-banking-info.component';

describe('ShowCompanyBankingInfoComponent', () => {
  let component: ShowCompanyBankingInfoComponent;
  let fixture: ComponentFixture<ShowCompanyBankingInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowCompanyBankingInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCompanyBankingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

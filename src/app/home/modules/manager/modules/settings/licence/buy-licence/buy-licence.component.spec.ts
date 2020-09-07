import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyLicenceComponent } from './buy-licence.component';

describe('BuyLicenceComponent', () => {
  let component: BuyLicenceComponent;
  let fixture: ComponentFixture<BuyLicenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyLicenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyLicenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

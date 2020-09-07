import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenceExpirationComponent } from './licence-expiration.component';

describe('LicenceExpirationComponent', () => {
  let component: LicenceExpirationComponent;
  let fixture: ComponentFixture<LicenceExpirationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenceExpirationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenceExpirationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

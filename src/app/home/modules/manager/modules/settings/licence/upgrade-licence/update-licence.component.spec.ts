import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeLicenceComponent } from './upgrade-licence.component';

describe('UpdateLicenceComponent', () => {
  let component: UpgradeLicenceComponent;
  let fixture: ComponentFixture<UpgradeLicenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpgradeLicenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpgradeLicenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

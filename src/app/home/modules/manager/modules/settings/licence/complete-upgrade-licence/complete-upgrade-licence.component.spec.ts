import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteUpgradeLicenceComponent } from './complete-upgrade-licence.component';

describe('CompleteUpgradeLicenceComponent', () => {
  let component: CompleteUpgradeLicenceComponent;
  let fixture: ComponentFixture<CompleteUpgradeLicenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompleteUpgradeLicenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteUpgradeLicenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

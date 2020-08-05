import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLicenceComponent } from './upgrade-licence.component';

describe('UpdateLicenceComponent', () => {
  let component: UpdateLicenceComponent;
  let fixture: ComponentFixture<UpdateLicenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateLicenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateLicenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

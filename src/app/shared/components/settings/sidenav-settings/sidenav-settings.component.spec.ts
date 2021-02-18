import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavSettingsComponent } from './sidenav-settings.component';

describe('SidenavSettingsComponent', () => {
  let component: SidenavSettingsComponent;
  let fixture: ComponentFixture<SidenavSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidenavSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCompanyHomeComponent } from './edit-company-home.component';

describe('EditCompanyHomeComponent', () => {
  let component: EditCompanyHomeComponent;
  let fixture: ComponentFixture<EditCompanyHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCompanyHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCompanyHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

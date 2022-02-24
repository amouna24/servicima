import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteRequiredInformationComponent } from './complete-required-information.component';

describe('CompleteRequiredInformationComponent', () => {
  let component: CompleteRequiredInformationComponent;
  let fixture: ComponentFixture<CompleteRequiredInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompleteRequiredInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteRequiredInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

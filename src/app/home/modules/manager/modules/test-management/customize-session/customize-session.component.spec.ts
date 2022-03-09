import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeSessionComponent } from './customize-session.component';

describe('CustomizeSessionComponent', () => {
  let component: CustomizeSessionComponent;
  let fixture: ComponentFixture<CustomizeSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomizeSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizeSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredCodeComponent } from './expired-code.component';

describe('ExpiredCodeComponent', () => {
  let component: ExpiredCodeComponent;
  let fixture: ComponentFixture<ExpiredCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiredCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

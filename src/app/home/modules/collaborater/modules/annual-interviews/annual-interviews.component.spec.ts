import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualInterviewsComponent } from './annual-interviews.component';

describe('AnnualInterviewsComponent', () => {
  let component: AnnualInterviewsComponent;
  let fixture: ComponentFixture<AnnualInterviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnualInterviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualInterviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

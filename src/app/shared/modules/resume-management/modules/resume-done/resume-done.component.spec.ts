import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeDoneComponent } from './resume-done.component';

describe('ResumeDoneComponent', () => {
  let component: ResumeDoneComponent;
  let fixture: ComponentFixture<ResumeDoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumeDoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

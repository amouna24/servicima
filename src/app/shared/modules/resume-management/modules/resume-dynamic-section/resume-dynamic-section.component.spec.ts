import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeDynamicSectionComponent } from './resume-dynamic-section.component';

describe('ResumeDynamicSectionComponent', () => {
  let component: ResumeDynamicSectionComponent;
  let fixture: ComponentFixture<ResumeDynamicSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumeDynamicSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeDynamicSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

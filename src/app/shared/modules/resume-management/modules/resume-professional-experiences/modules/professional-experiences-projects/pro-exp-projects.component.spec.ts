import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProExpProjectsComponent } from './pro-exp-projects.component';

describe('ProExpProjectsComponent', () => {
  let component: ProExpProjectsComponent;
  let fixture: ComponentFixture<ProExpProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProExpProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProExpProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

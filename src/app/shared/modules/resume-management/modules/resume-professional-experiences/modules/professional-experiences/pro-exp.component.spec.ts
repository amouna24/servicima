import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProExpComponent } from './pro-exp.component';

describe('ProExpComponent', () => {
  let component: ProExpComponent;
  let fixture: ComponentFixture<ProExpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProExpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProExpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

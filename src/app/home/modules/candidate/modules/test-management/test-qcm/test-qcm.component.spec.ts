import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestQcmComponent } from './test-qcm.component';

describe('TestQcmComponent', () => {
  let component: TestQcmComponent;
  let fixture: ComponentFixture<TestQcmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestQcmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestQcmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

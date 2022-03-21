import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCongratulationsComponent } from './test-congratulations.component';

describe('TestCongratulationsComponent', () => {
  let component: TestCongratulationsComponent;
  let fixture: ComponentFixture<TestCongratulationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestCongratulationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCongratulationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

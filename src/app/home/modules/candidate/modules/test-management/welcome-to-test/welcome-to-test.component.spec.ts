import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeToTestComponent } from './welcome-to-test.component';

describe('WelcomeToTestComponent', () => {
  let component: WelcomeToTestComponent;
  let fixture: ComponentFixture<WelcomeToTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeToTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeToTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

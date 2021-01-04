import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightSidenaveComponent } from './right-sidenave.component';

describe('RightSidenaveComponent', () => {
  let component: RightSidenaveComponent;
  let fixture: ComponentFixture<RightSidenaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightSidenaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightSidenaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

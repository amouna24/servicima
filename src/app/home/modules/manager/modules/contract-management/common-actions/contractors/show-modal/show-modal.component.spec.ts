import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowModalComponent } from './show-modal.component';

describe('ShowModalComponent', () => {
  let component: ShowModalComponent;
  let fixture: ComponentFixture<ShowModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneCreationComponent } from './done-creation.component';

describe('DoneCreationComponent', () => {
  let component: DoneCreationComponent;
  let fixture: ComponentFixture<DoneCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoneCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoneCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

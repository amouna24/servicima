import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboraterComponent } from './collaborater.component';

describe('CollaboraterComponent', () => {
  let component: CollaboraterComponent;
  let fixture: ComponentFixture<CollaboraterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboraterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboraterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

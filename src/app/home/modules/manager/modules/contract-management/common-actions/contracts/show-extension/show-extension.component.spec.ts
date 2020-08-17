import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowExtentionComponent } from './show-extension.component';

describe('ShowExtentionComponent', () => {
  let component: ShowExtentionComponent;
  let fixture: ComponentFixture<ShowExtentionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowExtentionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowExtentionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

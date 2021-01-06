import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowExtensionComponent } from './show-extension.component';

describe('ShowExtentionComponent', () => {
  let component: ShowExtensionComponent;
  let fixture: ComponentFixture<ShowExtensionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowExtensionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowExtensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

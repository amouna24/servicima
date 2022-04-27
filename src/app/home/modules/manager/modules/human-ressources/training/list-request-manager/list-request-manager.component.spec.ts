import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRequestManagerComponent } from './list-request-manager.component';

describe('ListRequestManagerComponent', () => {
  let component: ListRequestManagerComponent;
  let fixture: ComponentFixture<ListRequestManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRequestManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRequestManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

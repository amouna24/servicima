import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProExpListComponent } from './pro-exp-list.component';

describe('ProExpListComponent', () => {
  let component: ProExpListComponent;
  let fixture: ComponentFixture<ProExpListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProExpListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProExpListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

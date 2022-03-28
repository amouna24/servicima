import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogInviteComponent } from './dialog-invite.component';

describe('DialogInviteComponent', () => {
  let component: DialogInviteComponent;
  let fixture: ComponentFixture<DialogInviteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogInviteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

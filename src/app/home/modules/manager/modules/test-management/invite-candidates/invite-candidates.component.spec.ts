import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteCandidatesComponent } from './invite-candidates.component';

describe('InviteCandidatesComponent', () => {
  let component: InviteCandidatesComponent;
  let fixture: ComponentFixture<InviteCandidatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteCandidatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

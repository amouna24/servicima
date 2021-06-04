import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectCollaboratorComponent } from './affect-collaborator.component';

describe('AffectCollaboratorComponent', () => {
  let component: AffectCollaboratorComponent;
  let fixture: ComponentFixture<AffectCollaboratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffectCollaboratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffectCollaboratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseCandidatesComponent } from './choose-candidates.component';

describe('ChooseCandidatesComponent', () => {
  let component: ChooseCandidatesComponent;
  let fixture: ComponentFixture<ChooseCandidatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseCandidatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

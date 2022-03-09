import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelBlocComponent } from './level-bloc.component';

describe('LevelBlocComponent', () => {
  let component: LevelBlocComponent;
  let fixture: ComponentFixture<LevelBlocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelBlocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelBlocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

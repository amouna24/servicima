import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBlocComponent } from './edit-bloc.component';

describe('EditBlocComponent', () => {
  let component: EditBlocComponent;
  let fixture: ComponentFixture<EditBlocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBlocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBlocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

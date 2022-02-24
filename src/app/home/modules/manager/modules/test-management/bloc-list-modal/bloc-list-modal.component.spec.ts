import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocListModalComponent } from './bloc-list-modal.component';

describe('BlocListModalComponent', () => {
  let component: BlocListModalComponent;
  let fixture: ComponentFixture<BlocListModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlocListModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlocListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

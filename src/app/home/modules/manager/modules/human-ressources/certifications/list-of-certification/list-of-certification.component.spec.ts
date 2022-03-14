import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfCertificationComponent } from './list-of-certification.component';

describe('ListOfCertificationComponent', () => {
  let component: ListOfCertificationComponent;
  let fixture: ComponentFixture<ListOfCertificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfCertificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfCertificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

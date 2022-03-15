import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCertificationComponent } from './show-certification.component';

describe('ShowCertificationComponent', () => {
  let component: ShowCertificationComponent;
  let fixture: ComponentFixture<ShowCertificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowCertificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCertificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleCertifComponent } from './title-certif.component';

describe('TitleCertifComponent', () => {
  let component: TitleCertifComponent;
  let fixture: ComponentFixture<TitleCertifComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleCertifComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleCertifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

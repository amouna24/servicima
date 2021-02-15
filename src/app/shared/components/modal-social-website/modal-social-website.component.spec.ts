import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSocialWebsiteComponent } from './modal-social-website.component';

describe('ModalSocialWebsiteComponent', () => {
  let component: ModalSocialWebsiteComponent;
  let fixture: ComponentFixture<ModalSocialWebsiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSocialWebsiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSocialWebsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

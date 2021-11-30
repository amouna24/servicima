import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailingModalComponent } from './mailing-modal.component';

describe('MailingModalComponent', () => {
  let component: MailingModalComponent;
  let fixture: ComponentFixture<MailingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

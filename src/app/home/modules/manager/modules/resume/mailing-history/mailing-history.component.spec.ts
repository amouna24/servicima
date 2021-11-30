import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailingHistoryComponent } from './mailing-history.component';

describe('MailingHistoryComponent', () => {
  let component: MailingHistoryComponent;
  let fixture: ComponentFixture<MailingHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailingHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

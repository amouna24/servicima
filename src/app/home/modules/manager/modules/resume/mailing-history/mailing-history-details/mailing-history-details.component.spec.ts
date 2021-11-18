import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailingHistoryDetailsComponent } from './mailing-history-details.component';

describe('MailingHistoryDetailsComponent', () => {
  let component: MailingHistoryDetailsComponent;
  let fixture: ComponentFixture<MailingHistoryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailingHistoryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailingHistoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

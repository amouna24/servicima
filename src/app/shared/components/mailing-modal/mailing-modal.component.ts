import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wid-mailing-modal',
  templateUrl: './mailing-modal.component.html',
  styleUrls: ['./mailing-modal.component.scss']
})
export class MailingModalComponent implements OnInit {
  invoice = true;

  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'wid-confirm-list',
  templateUrl: './confirm-list.component.html',
  styleUrls: ['./confirm-list.component.scss']
})
export class ConfirmListComponent implements OnInit {
  @Input() list: any[];
  @Input() message: string;
  @Output() messageChange = new EventEmitter<{ data: any }>();
  constructor() { }

  ngOnInit(): void {
  }
  getMessage(rowData) {
    this.messageChange.emit({ data: rowData });
  }
}

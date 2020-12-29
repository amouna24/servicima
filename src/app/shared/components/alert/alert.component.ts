import { Component, OnInit , Input } from '@angular/core';

@Component({
  selector: 'wid-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  @Input() type: string;
  @Input() message: string;
  constructor() { }

  ngOnInit(): void {
  }

}

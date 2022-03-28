import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'wid-done-creation',
  templateUrl: './done-creation.component.html',
  styleUrls: ['./done-creation.component.scss']
})
export class DoneCreationComponent implements OnInit {
  @Input() title: { name: string, color: string };
  @Input() image: { path: string, height: string, width?: string};
  @Input() message: string;
  @Input() invite: { name: string, color: string, background: string};
  @Input() home: { name: string, color: string, background: string};
  @Output() inviteAction = new EventEmitter<{ }>();
  @Output() homeAction = new EventEmitter<{ }>();
  constructor() { }

  ngOnInit(): void {
  }
  inviteClick() {
    this.inviteAction.emit('invite');
  }
  homeClick() {
    this.homeAction.emit('home');
  }

}

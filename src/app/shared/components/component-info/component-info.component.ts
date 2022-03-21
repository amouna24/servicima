import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'wid-component-info',
  templateUrl: './component-info.component.html',
  styleUrls: ['./component-info.component.scss']
})
export class ComponentInfoComponent implements OnInit {
  @Input() title: { name: string, color: string };
  @Input() image: { path: string, height: string, width?: string};
  @Input() message: string;
  @Input() button: { name: string, color: string, background: string};
  @Output() buttonAction = new EventEmitter<{ }>();
  constructor() { }

  ngOnInit(): void {
  }

  clickButton() {
    this.buttonAction.emit('clicked');
  }

}

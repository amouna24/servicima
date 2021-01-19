import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'wid-model-modal',
  templateUrl: './model-modal.component.html',
  styleUrls: ['./model-modal.component.scss']
})
export class ModelModalComponent implements OnInit {
  @Input() modelConfig: {
    title: string,
    button: {
      buttonLeft: {
        visible: boolean,
        name: string,
        color: string,
        background: string
      },
      buttonRight: {
        visible: boolean,
        name: string,
        color: string,
        background: string
      },
    },
    style: any
  };
  @Output() emitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void {
  }
  closeModal() {
    console.log('hello world');

  }
  confirm() {
    this.emitter.emit(true);
  }
  cancel() {
    this.emitter.emit(false);
  }
}

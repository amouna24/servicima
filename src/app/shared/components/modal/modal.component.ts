import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'wid-model-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
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
  @Input() form;
  @Input() existForm;
  @Output() emitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void { }

  confirm() {
    this.emitter.emit(true);
  }
  cancel() {
    this.emitter.emit(false);
  }
}

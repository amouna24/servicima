import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IModalModel } from '@shared/models/modal.model';

@Component({
  selector: 'wid-model-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() modelConfig: IModalModel;
  @Input() form;
  @Input() existForm;
  @Output() emitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void { }

  confirm(nextValue) {
    this.emitter.emit(nextValue);
  }
}

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BehaviorSubject, } from 'rxjs';

@Component({
  selector: 'wid-confirm-list',
  templateUrl: './confirm-list.component.html',
  styleUrls: ['./confirm-list.component.scss']
})
export class ConfirmListComponent implements OnInit {

  constructor() {
  }
  @Input() DATA: BehaviorSubject<any[]>;
  @Input() requiredFields: string[];
  @Input() selectAllBtn: boolean;
  @Input() btnLabel: string;
  @Input() title: string;
  @Input() message: { field: string, message: string };
  @Input() selectList: {
    data: any[],
    value: string | string[],
    text: string | string[],
    selected: string,
    placeHolder?: string
  };
  @Output() action = new EventEmitter<{ data: any }>();
  @Output() dialogAction = new EventEmitter<any>();

  showList = new BehaviorSubject<any[]>([]);
  unknownList = new BehaviorSubject<any[]>([]);
  async ngOnInit(): Promise<void> {
    this.btnLabel = this.btnLabel ? this.btnLabel : 'Confirm';
    await this.initData();
  }

  async initData(): Promise<void> {
    if (this.requiredFields.length > 0) {
      await this.verifyRequiredFields();
    } else {
      this.DATA.subscribe((data) => {
        this.showList.next(data);
      });

    }
  }
 async verifyRequiredFields(): Promise<void> {
   this.DATA.subscribe(
      (res) => {
        this.showList.next([]);
        this.unknownList.next([]);
        res.map(
          row => {
            if (!this.missingField(row)) {
              this.showList.next(this.showList.getValue().concat(row));
            } else {
              this.unknownList.next(this.unknownList.getValue().concat(row));
            }
          });
      });
  }

  isLoaded(): boolean {
    const dataLoaded = this.DATA.value.length === (this.showList.value.length + this.unknownList.value.length);
    const selectList = this.selectList ? this.selectList.data.length > 0 : true;
    return dataLoaded && selectList ;
  }

 missingField(rowData: any): boolean {
    let result: boolean;
    this.requiredFields.map(
      data => { if (!rowData[data]) { result = true; }});
        return result;
  }

  detectUnknownFile(): string {
      if (this.unknownList.getValue().length === 1) {
        return `There is one unknown file!`;
      } else if (this.unknownList.getValue().length > 0) {
        return `There is ${this.unknownList.getValue().length} unknown files!`;
      } else {
        return '';
      }
  }

  actionClick(file: any): void {
    this.action.emit(file);
    file['selected'] = true;
  }

  selectAll(): void {
    this.showList.value.map((row) => {
      if (! row['selected']) { this.actionClick(row); }
    });
  }
  modalActions(action?: any): void {
    if (action) {
      this.dialogAction.emit(action);
    } else {
      this.dialogAction.emit('close');
    }
  }

  setFlexLayout(): string {
    return this.selectList ? 'space-around center' : 'space-between center' ;
  }
  getSelectField(field: string, data: any): string {
    if (typeof this.selectList[field] === 'string') {
      return data[this.selectList[field]];
    } else {
      let result = null;
      this.selectList[field].map((val) => {
        result = result == null ? data[val] : result[val];
      });
      return result;
    }
  }

  setMessage(file: any): string {
    const field = '<span class="decoration golden-yellow cursor-pointer">' + file[this.message.field] + '</span>';
    return this.message.message.replace('[$VALUE]', field);
  }
}

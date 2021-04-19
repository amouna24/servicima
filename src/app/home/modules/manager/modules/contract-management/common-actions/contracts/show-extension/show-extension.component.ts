import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'wid-show-extension',
  templateUrl: './show-extension.component.html',
  styleUrls: ['./show-extension.component.scss']
})
export class ShowExtensionComponent implements OnInit {

  modelConfig = {
    title: 'Show contract details',
    button: {
      buttonLeft: {
        visible: true,
        name: 'Close',
        color: '#232323',
        background: '#f3f6f9',
        nextValue: false,
      }
    },
    style: {
      colorTitle: '#0067e0',
    }
  };

  constructor(
    public dialogRef: MatDialogRef<ShowExtensionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
  }

  /**
   * @description : action
   * param res: boolean
   */
  onNotify(res: boolean): void {
    if (!res) {
      this.dialogRef.close();
    }
  }
}

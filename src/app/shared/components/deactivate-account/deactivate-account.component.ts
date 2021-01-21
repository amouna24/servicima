import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'wid-deactivate-account',
  templateUrl: './deactivate-account.component.html',
  styleUrls: ['./deactivate-account.component.scss']
})
export class DeactivateAccountComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeactivateAccountComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }
  modelConfig = {
    title: '',
    button: {
      buttonLeft: {
        visible: true,
        name: 'Desactivate',
        color: ' #f3f6f9',
        background: '#d24d57'
      },
      buttonRight: {
        visible: true,
        name: 'cancel',
        color: '#232323',
        background: '#f3f6f9'
      },
    },
    style: {
    }
  };
  ngOnInit(): void {
  }

  onNotify(res: boolean): void {
    if (!res) {
      this.dialogRef.close();
    }
  }

}

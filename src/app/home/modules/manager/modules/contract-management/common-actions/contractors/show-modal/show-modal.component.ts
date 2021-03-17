import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UploadService } from '@core/services/upload/upload.service';

@Component({
  selector: 'wid-show-modal',
  templateUrl: './show-modal.component.html',
  styleUrls: ['./show-modal.component.scss']
})
export class ShowModalComponent implements OnInit {

  modelConfig = {
    title: 'Customer profile',
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
  contractorAvatar: any;

  constructor(
    public dialogRef: MatDialogRef<ShowModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private uploadService: UploadService,
    ) {
  }

  ngOnInit(): void {
    this.uploadService.getImage(this.data.contractor.photo).then(
      (res) => {
        this.contractorAvatar = res;
      }
    );
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

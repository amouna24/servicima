import { Component, OnInit, Inject } from '@angular/core';
import { ModalService } from '@core/services/modal/modal.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'wid-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {
  existForm = false;
  constructor(public dialogRef: MatDialogRef<ConfirmationModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private modalService: ModalService, ) {
  }

  modelConfig: any;
  ngOnInit(): void {
    this.displayStyle();
  }

  onNotify(res: boolean): void {
      this.dialogRef.close();
      this.modalService.emitConfirmationModalResponse(res);
  }

  displayStyle() {
    switch (this.data.code) {
      case 'desactivate': {
        this.modelConfig = {
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

        break;
      }
      case 'edit': {
        this.modelConfig = {
          title: '',
          button: {
            buttonLeft: {
              visible: true,
              name: 'Confirm',
              color: ' #f3f6f9',
              background: '#0459bc'
            },
            buttonRight: {
              visible: true,
              name: 'cancel',
              color: '#232323',
              background: '#f3f6f9'
            },
          },
          style: { }
        };
        break;
      }
      case 'add': {
        this.modelConfig = {
          title: '',
          button: {
            buttonLeft: {
              visible: true,
              name: 'Confirm',
              color: ' #f3f6f9',
              background: '#0459bc'
            },
            buttonRight: {
              visible: true,
              name: 'cancel',
              color: '#232323',
              background: '#f3f6f9'
            },
          },
          style: { }
        };
        break;
      }
      case 'changeStatus': {
        this.modelConfig = {
          title: '',
          button: {
            buttonLeft: {
              visible: true,
              name: this.data.status === 'ACTIVE' ? 'DESACTIVATE' : 'ACTIVATE',
              color: this.data.status === 'ACTIVE' ? 'white' : 'black',
              background: this.data.status === 'ACTIVE' ? 'red' : 'blue',
            },
            buttonRight: {
              visible: true,
              name: 'cancel',
              color: '#232323',
              background: '#f3f6f9'
            },
          },
          style: { }
        };
        break;
      }
      default: {
      }
    }
  }
}

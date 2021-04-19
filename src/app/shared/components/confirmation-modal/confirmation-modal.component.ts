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
      case 'deactivate': {
        this.modelConfig = {
          title: '',
          button: {
            buttonLeft: {
              visible: true,
              name: 'Deactivate',
              color: ' #f3f6f9',
              nextValue: true,
              background: '#d24d57'
            },
            buttonRight: {
              visible: true,
              name: 'cancel',
              nextValue: false,
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
              nextValue: true,
              background: '#0459bc'
            },
            buttonRight: {
              visible: true,
              name: 'cancel',
              nextValue: false,
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
              background: '#0459bc',
              nextValue: true,
            },
            buttonRight: {
              visible: true,
              name: 'cancel',
              color: '#232323',
              background: '#f3f6f9',
              nextValue: false,
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
              name: this.data.status === 'A' ? 'Deactivate' : 'Activate',
              color: this.data.status === 'A' ? 'white' : 'white',
              background: this.data.status === 'A' ? '#d24d57' : '#1bc5bd',
              nextValue: true,
            },
            buttonRight: {
              visible: true,
              name: 'cancel',
              color: '#232323',
              background: '#f3f6f9',
              nextValue: false,
            },
          },
          style: { }
        };
        break;
      }
      case 'delete': {
        this.modelConfig = {
          title: '',
          button: {
            buttonLeft: {
              visible: true,
              name: 'Delete',
              color: 'white',
              background: '#d24d57',
              nextValue: true,
            },
            buttonRight: {
              visible: true,
              name: 'cancel',
              color: '#232323',
              background: '#f3f6f9',
              nextValue: false,
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

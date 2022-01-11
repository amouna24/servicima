import { Component, OnInit, Inject } from '@angular/core';
import { ModalService } from '@core/services/modal/modal.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'wid-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {
  existForm = false;
  description: string;
  title: string;
  modelConfig: any;
  constructor(public dialogRef: MatDialogRef<ConfirmationModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public translate: TranslateService,
              private modalService: ModalService, ) {
  }

  ngOnInit(): void {
    this.getTranslate();
    this.displayStyle();
  }

  onNotify(res: boolean): void {
      this.dialogRef.close();
      this.modalService.emitConfirmationModalResponse(res);
  }

  getTranslate() {
    this.translate.get(this.data.description).subscribe((data: string) => {
      this.description = data;
    });
    this.translate.get(this.data.title).subscribe((data: string) => {
      this.title = data;
    });
  }

  displayStyle() {
    switch (this.data.code) {
      case 'deactivate': {
        this.modelConfig = {
          title: '',
          button: {
            buttonLeft: {
              visible: true,
              name: 'button.deactivate',
              color: ' #f3f6f9',
              nextValue: true,
              background: '#d24d57'
            },
            buttonRight: {
              visible: true,
              name: 'button.cancel',
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
              name: 'button.confirm',
              color: ' #f3f6f9',
              nextValue: true,
              background: '#0459bc'
            },
            buttonRight: {
              visible: true,
              name: 'button.cancel',
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
              name: 'button.confirm',
              color: ' #f3f6f9',
              background: '#0459bc',
              nextValue: true,
            },
            buttonRight: {
              visible: true,
              name: 'button.cancel',
              color: '#232323',
              background: '#f3f6f9',
              nextValue: false,
            },
          },
          style: { }
        };
        break;
      }
      case 'error': {
        this.modelConfig = {
          title: '',
          button: {
            buttonLeft: {
              visible: true,
              name: 'button.yes',
              color: '#f3f6f9',
              background: '#FF0000',
              nextValue: true,
            },
            buttonRight: {
              visible: false,
              name: 'button.cancel',
              color: '#232323',
              background: '#f3f6f9',
              nextValue: false,
            },
          },
          style: { }
        };
        break;
      }
      case 'message': {
        this.modelConfig = {
          title: '',
          button: {
            buttonLeft: {
              visible: false,
              name: 'button.confirm',
              color: ' #f3f6f9',
              background: '#0459bc',
              nextValue: true,
            },
            buttonRight: {
              visible: false,
              name: 'button.cancel',
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
              name: this.data.status === 'A' ? 'button.deactivate' : 'button.activate' +
                '',
              color: this.data.status === 'A' ? 'white' : 'white',
              background: this.data.status === 'A' ? '#d24d57' : '#1bc5bd',
              nextValue: true,
            },
            buttonRight: {
              visible: true,
              name: 'button.cancel',
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
              name: 'button.delete',
              color: 'white',
              background: '#d24d57',
              nextValue: true,
            },
            buttonRight: {
              visible: true,
              name: 'button.cancel',
              color: '#232323',
              background: '#f3f6f9',
              nextValue: false,
            },
          },
          style: { }
        };
        break;
      }
      case 'info': {
        this.modelConfig = {
          title: '',
          button: {
            buttonLeft: {
              visible: true,
              name: 'button.yes',
              color: 'white',
              background: 'green',
              nextValue: true,
            },
            buttonRight: {
              visible: false,
              name: 'button.cancel',
              color: '#232323',
              background: '#f3f6f9',
              nextValue: false,
            },
          },
          style: { }
        };
        break;
      }
      case 'confirmation': {
        this.modelConfig = {
          title: '',
          button: {
            buttonLeft: {
              visible: true,
              name: 'button.yes',
              color: ' #f3f6f9',
              background: '#0459bc',
              nextValue: true,
            },
            buttonRight: {
              visible: true,
              name: 'button.no',
              color: '#232323',
              background: '#f3f6f9',
              nextValue: false,
            },
          },
          style: { }
        };
        break;
      }
      case 'preview': {
        this.modelConfig = {
          title: '',
          button: {
            buttonLeft: {
              visible: true,
              name: 'button.preview',
              color: 'white',
              background: 'blue',
              nextValue: true,
            },
            buttonRight: {
              visible: false,
              name: 'button.cancel',
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

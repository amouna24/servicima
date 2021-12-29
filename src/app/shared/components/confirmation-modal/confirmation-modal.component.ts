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
              name: 'homecompany.desactivate',
              color: ' #f3f6f9',
              nextValue: true,
              background: '#d24d57'
            },
            buttonRight: {
              visible: true,
              name: 'company.banking.info.cancel',
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
              name: 'company.banking.info.confirm',
              color: ' #f3f6f9',
              nextValue: true,
              background: '#0459bc'
            },
            buttonRight: {
              visible: true,
              name: 'company.banking.info.cancel',
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
              name: 'company.banking.info.confirm',
              color: ' #f3f6f9',
              background: '#0459bc',
              nextValue: true,
            },
            buttonRight: {
              visible: true,
              name: 'company.banking.info.cancel',
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
              name: 'OK',
              color: '#f3f6f9',
              background: '#FF0000',
              nextValue: true,
            },
            buttonRight: {
              visible: false,
              name: 'company.banking.info.cancel',
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
              name: 'company.banking.info.confirm',
              color: ' #f3f6f9',
              background: '#0459bc',
              nextValue: true,
            },
            buttonRight: {
              visible: false,
              name: 'company.banking.info.cancel',
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
              name: this.data.status === 'A' ? 'homecompany.desactivate' : 'modal-activate' +
                '',
              color: this.data.status === 'A' ? 'white' : 'white',
              background: this.data.status === 'A' ? '#d24d57' : '#1bc5bd',
              nextValue: true,
            },
            buttonRight: {
              visible: true,
              name: 'company.banking.info.cancel',
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
              name: 'resume-delete',
              color: 'white',
              background: '#d24d57',
              nextValue: true,
            },
            buttonRight: {
              visible: true,
              name: 'company.banking.info.cancel',
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
              name: 'OK',
              color: 'white',
              background: 'green',
              nextValue: true,
            },
            buttonRight: {
              visible: false,
              name: 'company.banking.info.cancel',
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
              name: 'yes',
              color: ' #f3f6f9',
              background: '#0459bc',
              nextValue: true,
            },
            buttonRight: {
              visible: true,
              name: 'modal-no',
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
              name: 'cand.menu.static.preview',
              color: 'white',
              background: 'blue',
              nextValue: true,
            },
            buttonRight: {
              visible: false,
              name: 'company.banking.info.cancel',
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

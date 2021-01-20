import { Component, OnInit, Inject, Input } from '@angular/core';
import { ModalService } from '@core/services/modal/modal.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'wid-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

  constructor(  private modalService: ModalService,
                private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  formLogin: FormGroup;
  modelConfig = {
    title: 'Customer profile',
    button: {
      buttonLeft: {
        visible: true,
        name: 'confirm',
        color: '#232323',
        background: '#f3f6f9'
      },
      buttonRight: {
        visible: true,
        name: 'cancel',
        color: '#f3f6f9',
        background: '#0067e0'
      },
    },
    style: {
    }
  };
  ngOnInit(): void {
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

  }

  onNotify(res: boolean): void {
   if (!res) {
   this.dialogRef.close();
 }
    console.log(this.formLogin.value.email);
  }
}

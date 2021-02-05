import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'wid-modal-social-website',
  templateUrl: './modal-social-website.component.html',
  styleUrls: ['./modal-social-website.component.scss']
})
export class ModalSocialWebsiteComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ModalSocialWebsiteComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder, ) { }
  form: FormGroup;
  list = ['Linkedin', 'Twitter', 'Youtube'];
  modelConfig = {
    title: '',
    button: {
      buttonRight: {
        visible: true,
        name: 'save',
        color: ' #f3f6f9',
        background: '#0067e0'
      },
      buttonLeft: {
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
    this.initForm();
  }
  /**
   * @description : initialization of the form
   */
  initForm(): void {
    this.form = this.formBuilder.group({
      twitterAccount: ['', [Validators.required]],
      youtubeAccount: ['', [Validators.required]],
      linkedinAccount: ['', [Validators.required]],
    });
    this.setForm();
  }

  /**
   * @description : set the value of the form if it was an update user
   */
  setForm() {
    this.form.setValue({
      twitterAccount: 'Linkedin',
      youtubeAccount: 'Twitter',
      linkedinAccount: 'Youtube',
    });
  }
  onNotify(res: boolean): void {
    if (!res) {
      this.dialogRef.close();
    }
  }

}

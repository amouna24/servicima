import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalService } from '@core/services/modal/modal.service';
import { Subscription } from 'rxjs';
import { ProfileService } from '@core/services/profile/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'wid-modal-social-website',
  templateUrl: './modal-social-website.component.html',
  styleUrls: ['./modal-social-website.component.scss']
})
export class ModalSocialWebsiteComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ModalSocialWebsiteComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private modalService: ModalService,
              private profileService: ProfileService,
              private formBuilder: FormBuilder,
              private router: Router, ) {
  }

  form: FormGroup;
  input1;
  input2;
  input3;
  input = ['input1', 'input2', 'input3', 'input4'];
  twitter;
  private subscriptions: Subscription[] = [];
  list = ['linkedin_url', 'twitter_url', 'youtube_url', 'facebook', 'whatsapp',
    'instagram', 'viber', 'skype', 'other'];
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
    style: { }
  };

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * @description : initialization of the form
   */
  initForm(): void {
    this.form = this.formBuilder.group({
      input1: [''],
      input2: [''],
      input3: [''],
      facebookAccount: [''],
      instagramAccount: [''],
      viberAccount: [''],
      skypeAccount: [''],
      otherAccount: [''],
      whatsappAccount: [''],
      others: this.formBuilder.array([]),
    });
    this.setForm();
  }

  /**
   * @description : set the value of the form if it was an update user
   */
  setForm() {
    this.form.setValue({
      input1: this.data.twitter_url,
      input2: this.data.youtube_url,
      input3: this.data.linkedin_url,
      others: [],
      facebookAccount: '',
      instagramAccount: '',
      viberAccount: '',
      skypeAccount: '',
      otherAccount: '',
      whatsappAccount: '',
    });
  }

  onNotify(res: boolean): void {
    // console.log(res, 'res');
    if (res) {
      this.dialogRef.close();
    } else {
     const updateUser = {
        application_id: this.data['userKey'].application_id,
        email_address: this.data['userKey'].email_address,
        company_email: this.data['company_email'],
        user_type: this.data['user_type'],
        first_name: this.data.first_name,
        last_name: this.data.last_name,
        gender_id: this.data.gender_id,
        prof_phone: this.data.prof_phone,
        cellphone_nbr: this.data.cellphone_nbr,
        language_id: this.data.language_id,
        title_id: this.data.title_id,
        updated_by: this.data.updated_by,
        linkedin_url: this.form.value.linkedinAccount,
        twitter_url: this.form.value.twitterAccount,
        youtube_url: this.form.value.youtubeAccount,
        photo: this.data.photo,
      };
      console.log(updateUser, 'update user');
     /* this.subscriptions.push(this.profileService.updateUser(updateUser).subscribe(
        result => {
          if (result) {
            this.dialogRef.close();
          }
        })
      );*/
      console.log(this.input1, 'input1', this.input2, 'input2', this.input3, 'input3');
    }
  }

  getValue(name, number) {
    console.log(name, number);
    this.list.forEach(element => {
      if (name === element && number === 1) {
        console.log(name, 'name');
        this.input1 = name;
        console.log(this.input1, 'input 1');
      } else if (name === element && number === 2) {
        this.input2 = name;
        console.log(this.input2, 'input 2');
      } else if (name === element && number === 3) {
        this.input3 = name;
        console.log(this.input3, 'input 3');
      }
    });
  }
  setValue() {
    console.log('kkkkkkkkkkkkkkkkkkkk');
    console.log(this.input1, 'this.llll');
    this.list.forEach(element => {
      if (this.input1 === element) {
        this.twitter = this.form.value.input1;
        console.log(this.twitter, 'dddd');
      }
    });
    }
}

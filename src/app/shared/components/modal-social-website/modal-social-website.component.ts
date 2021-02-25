import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ModalService } from '@core/services/modal/modal.service';
import { ProfileService } from '@core/services/profile/profile.service';
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
    private formBuilder: FormBuilder, ) {
  }
  private subscriptions: Subscription[] = [];
  form: FormGroup;
  leng = 0;
  input1: string;
  input2: string;
  input3: string;
  input4: string;
  input5: string;
  input6: string;
  input7: string;
  input8: string;
  input9: string;
  newTable = [];
  dynamicInput = [
    {
      select: 'twitter',
      value: this.data?.twitter_url
    },
    {
      select: 'linkedin',
      value: this.data?.linkedin_url
    },
    {
      select: 'youtube',
      value: this.data?.youtube_url
    },
    {
      select: 'whatsapp',
      value: this.data?.whatsapp_url
    },
    {
      select: 'viber',
      value: this.data?.viber_url
    },
    {
      select: 'other',
      value: this.data?.other_url
    },
    {
      select: 'facebook',
      value: this.data?.facebook_url
    },
    {
      select: 'skype',
      value: this.data?.skype_url
    },
    {
      select: 'instagram',
      value: this.data?.instagram_url
    },
  ];
  dynamicListSelect = [];
  listInput = [
    {
      'title': 'this.input1',
      'value': this['input1']
    },
    {
      'title': 'this.input2',
      'value': this['input2']
    },
    {
      'title': 'this.input3',
      'value': this['input3']
    },
    {
      'title': 'this.input4',
      'value': this['input4']
    },
    {
      'title': 'this.input5',
      'value': this['input5']
    },
    {
      'title': 'this.input6',
      'value': this['input6']
    },
    {
      'title': 'this.input7',
      'value': this['input7']
    },
    {
      'title': 'this.input8',
      'value': this['input8']
    },
    {
      'title': 'this.input9',
      'value': this['input9']
    }
  ];
  list = [
    { value: 'linkedin', selected: false },
    { value: 'twitter', selected: false },
    { value: 'youtube', selected: false },
    { value: 'facebook', selected: false },
    { value: 'whatsapp', selected: false },
    { value: 'instagram', selected: false },
    { value: 'viber', selected: false },
    { value: 'skype', selected: false },
    { value: 'other', selected: false },
  ];
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
    this.dynamicInput.map((res) => {
      if (res.value) {
        this.newTable.push(res);
      }
    });
    if (this.newTable.length === 0) {
      this.newTable.push({ select: 'linkedin',
      value: ''}
    );
    }
    this.initForm();
  }

  /**
   * @description : initialization of the form
   */
  initForm(): void {
    this.form = this.formBuilder.group({
      input4: this.formBuilder.array(this.newTable.map((res) => {
        this.dynamicListSelect.push({ 'input': res.value, 'select': res.select });
        this.leng = this.dynamicListSelect.length;
        for (let i = 0; i < this.leng; i++) {
          this.listInput[i].value = this.dynamicListSelect[i].select;
        }
        return res.value;
      })),
    });
    this.dynamicListSelect.map((element) => {
      this.list.find(el => el.value === element.select).selected = true;
    });
  }

  /**
   * @description : action
   * param res: boolean
   */
  onNotify(res: boolean): void {
    if (res) {
      this.dialogRef.close();
    } else {
      if (this.data.zip_code) {
        const updateCompany = {
          _id: this.data._id,
          application_id: this.data.companyKey.application_id,
          email_address: this.data.companyKey.email_address,
          company_name: this.data['company_name'],
          activity_code: this.data['activity_code'],
          activity_desc: this.data.activity_desc,
          adress: this.data.adress,
          capital: this.data.capital,
          city: this.data.city,
          contact_email: this.data.contact_email,
          country_id: this.data.country_id,
          currency_id: this.data.currency_id,
          employee_nbr: this.data.employee_nbr,
          fax_nbr: this.data.fax_nbr,
          legal_form: this.data.legal_form,
          phone_nbr1: this.data.phone_nbr1,
          phone_nbr2: this.data.phone_nbr2,
          reg_nbr: this.data.reg_nbr,
          registry_country: this.data.registry_country,
          zip_code: this.data.zip_code,
          updated_by: this.data.updated_by,
          linkedin_url: this.data.linkedin_url,
          twitter_url: this.data.twitter_url,
          youtube_url: this.data.youtube_url,
          facebook_url: this.data.facebook_url,
          instagram_url: this.data.instagram_url,
          whatsapp_url: this.data.whatsapp_url,
          viber_url: this.data.viber_url,
          skype_url: this.data.skype_url,
          other_url: this.data.other_url,
          photo: this.data.photo,
        };
        this.setValue(updateCompany);
        this.subscriptions.push(this.profileService.updateCompany(updateCompany).subscribe(
          result => {
            if (result) {
              this.dialogRef.close(result);
            }
          }));
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
          linkedin_url: this.data.linkedin_url,
          twitter_url: this.data.twitter_url,
          youtube_url: this.data.youtube_url,
          facebook_url: this.data.facebook_url,
          instagram_url: this.data.instagram_url,
          whatsapp_url: this.data.whatsapp_url,
          viber_url: this.data.viber_url,
          skype_url: this.data.skype_url,
          other_url: this.data.other_url,
          photo: this.data.photo,
        };
        this.setValue(updateUser);
        this.subscriptions.push(this.profileService.updateUser(updateUser).subscribe(
          result => {
            if (result) {
              this.dialogRef.close(result);
            }
          })
        );
      }
    }
  }

  /**
   * @description  get list array input
   */
  getParam() {
    return this.form.get('input4') as FormArray;
  }

  /**
   * @description  add social network
   */
  onAddParam() {
    const newControl1 = this.formBuilder.control('');
    this.dynamicListSelect.push({
      input: null, select: null
    });
    return this.getParam().push(newControl1);
  }

  /**
   * @description  get social network selected
   * param name of current value of select : string
   * param number of input: string
   * last value of select: string
   */
  getValue(name: string, number: number, lastValueSelect: string): void {
    console.log(name, 'name', number, 'number', 'lan', lastValueSelect);
    this.list.find(el => el.value === name).selected = true;
    if (lastValueSelect) {
      this.list.find(el => el.value === lastValueSelect).selected = false;
    }
      this.list.forEach(element => {
        for (let i = 1; i < 10; i++) {
          if (name === element.value && number === i) {
            this.listInput[i - 1].value = name;
            console.log(this.listInput[i - 1].value, 'vbvvv');
            if (i === number) {
              this.form.get('input4.' + (i - 1)).setValue(this.data[name + '_url']);
              this.dynamicListSelect[number - 1 ].select = name;
            }
          }
        }
      });
  }

  /**
   * @description: get value of input
   * param input: string
   */
  getInput(input): string {
    for (let i = 1; i < 10; i++) {
      if (input === 'this.input' + i) {
        return this.form.value.input4[i - 1];
    }
    }
  }

  /**
   * @description: set value for user or company
   * param object (user or company)
   */
  setValue(object) {
    this.listInput.forEach(element => {
      if (element.value === 'twitter') {
        object.twitter_url = this.getInput(element.title);
      } else if (element.value === 'linkedin') {
        object.linkedin_url = this.getInput(element.title);
      } else if (element.value === 'youtube') {
        object.youtube_url = this.getInput(element.title);
      } else if (element.value === 'instagram') {
        object.instagram_url = this.getInput(element.title);
      } else if (element.value === 'whatsapp') {
        object.whatsapp_url = this.getInput(element.title);
      } else if (element.value === 'viber') {
        object.viber_url = this.getInput(element.title);
      } else if (element.value === 'skype') {
        object.skype_url = this.getInput(element.title);
      } else if (element.value === 'facebook') {
        object.facebook_url = this.getInput(element.title);
      } else if (element.value === 'other') {
        object.other_url = this.getInput(element.title);
      }
    });
  }

}

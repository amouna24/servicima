import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '@core/services/user/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'wid-add-payment-method',
  templateUrl: './add-payment-method.component.html',
  styleUrls: ['./add-payment-method.component.scss']
})
export class AddPaymentMethodComponent implements OnInit {
  form: FormGroup;
  company: string;
  companyId: string;
  language: string;
  listArray = [];
  languages = [];
  applicationId: string;
  emailAddress: string;
  /** subscription */
  subscriptionModal: Subscription;
  private subscriptions: Subscription[] = [];
  constructor( private formBuilder: FormBuilder,
               private userService: UserService,
               @Inject(MAT_DIALOG_DATA) public data: any,
               private appInitializerService: AppInitializerService,
               public dialogRef: MatDialogRef<AddPaymentMethodComponent>,
               private localStorageService: LocalStorageService,
               private utilsService: UtilsService,
               private refdataService: RefdataService) { }

  ngOnInit(): void {
    this.userService.connectedUser$.subscribe(
      (userInfo) => {
        if (userInfo) {
          this.company = userInfo['company'][0].company_name;
          this.companyId = userInfo['company'][0]._id;
        }
      });
    this.getLanguages();
    this.initForm();
    const cred = this.localStorageService.getItem('userCredentials');
    this.applicationId = cred['application_id'];
    this.emailAddress = cred['email_address'];
  }
  /**
   * @description : initialization of the form
   */
  initForm(): void {

    this.form = this.formBuilder.group({
      company: [{ value: this.company, disabled: true }],
      language: [this.data ? this.data.data.RefDataKey.language_id : '', [Validators.required]],
      methodName : [this.data ? this.data.data.ref_data_desc : '', [Validators.required]],
      input: this.formBuilder.array(this.data ? this.data.list.map(data => this.formBuilder.group({
        grade: [data.RefDataKey.language_id],
        value: [data.ref_data_desc]
      })) : []),
    });
  }

  /**
   * @description : action
   * param res: boolean
   */
  onNotify(res: boolean): void {
    if (!res) {
      this.dialogRef.close();
    } else {
      this.addMethodPaymentTerms();
    }
  }

  /**
   * @description  get list array input
   */
  getListNetworkSocial() {
    return this.form.get('input') as FormArray;
  }
  /**
   * @description  add social network
   */
  onAddAnotherNetworkSocial() {
    return this.getListNetworkSocial().push(this.formBuilder.group({ grade: '', value: '' }));
  }
  /**
   * @description: get languages
   */
  getLanguages(): void {
     this.language = this.localStorageService.getItem('language').langId;
    this.languages = [];
    this.languages = this.appInitializerService.languageList.map((lang) => {
      return ({ value: lang._id, viewValue: lang.language_desc, selected: false });
    });
    this.languages.find(el => el.value === this.language).selected = true;
  }
  getValue(value, rang) {
    this.languages.find(el => el.value === value).selected = true;
  }
  addMethodPaymentTerms() {
    if (this.data) {
      if (this.form.value.methodName !== this.data.data.ref_data_desc) {
      const methodPaymentMethod = {
        application_id: this.data.data.RefDataKey.application_id ,
        email_address: this.data.data.RefDataKey.email_address ,
        company_id: this.data.data.RefDataKey.company_id ,
        ref_type_id: this.data.data.RefDataKey.ref_type_id,
        language_id: this.data.data.RefDataKey.language_id ,
        ref_data_code: this.data.data.RefDataKey.ref_data_code ,
        ref_data_desc: this.form.value.methodName
      };
        this.refdataService.updaterefdata(methodPaymentMethod).subscribe((data) => {
          if (data) {
          }
        });
      }
      /* update role desc with other languages and add it if is not exist */
      let i = 0;
      this.form.value.input.map((desc) => {
        if (i < this.data.list.length ) {
          const roleUpdated = {
            application_id: this.data.data.RefDataKey.application_id,
            email_address: this.data.data.RefDataKey.email_address,
            company_id: this.data.data.RefDataKey.company_id,
            ref_type_id: this.data.data.RefDataKey.ref_type_id,
            language_id: desc.grade,
            ref_data_code: this.data.data.RefDataKey.ref_data_code,
            ref_data_desc: desc.value
          };
          this.refdataService.updaterefdata(roleUpdated).subscribe((data) => {
            if (data) {
              i = i + 1;
            }
          });
          this.dialogRef.close();
        } else {
          const listRoleUpdated = {
            application_id: this.data.data.RefDataKey.application_id,
            email_address: this.data.data.RefDataKey.email_address,
            company_id: this.data.data.RefDataKey.company_id,
            ref_type_id: this.data.data.RefDataKey.ref_type_id,
            language_id: desc.grade,
            ref_data_code: this.data.data.RefDataKey.ref_data_code,
            ref_data_desc: desc.value
          };
          this.refdataService.addrefdata(listRoleUpdated).subscribe((data) => {
            if (data) {
            }
          });
        }
      });
      this.dialogRef.close();

    } else {
    const methodPaymenetTerms = {
      application_id: this.applicationId,
      email_address: this.emailAddress,
      company_id: this.companyId,
      ref_type_id: this.utilsService.getRefTypeId('PAYMENT_MODE'),
      language_id: this.language,
      ref_data_code: this.form.value.methodName.split(' ').join('').toUpperCase(),
      ref_data_desc: this.form.value.methodName
    };
    this.refdataService.addrefdata(methodPaymenetTerms).subscribe(async (data) => {
      if (data) {
        console.log(data);
      }

    this.form.value.input.map((response) => {
      const methodPayment = {
        application_id: this.applicationId,
        email_address: this.emailAddress,
        company_id: this.companyId,
        ref_type_id: this.utilsService.getRefTypeId('PAYMENT_MODE'),
        language_id: response.grade,
        ref_data_code: this.form.value.methodName.split(' ').join('').toUpperCase(),
        ref_data_desc: response.value
      };
      this.refdataService.addrefdata(methodPayment).subscribe((res) => {
        if (res) {
          console.log(res);
        }
      });
    });
    const allList = await this.refdataService.getRefData( this.utilsService.getCompanyId(this.emailAddress, this.applicationId) , this.applicationId,
        ['PAYMENT_MODE'], true);
    this.dialogRef.close(allList['PAYMENT_MODE']);
    });
    }
    }
}

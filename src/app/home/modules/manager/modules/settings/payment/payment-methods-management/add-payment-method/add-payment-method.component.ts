import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '@core/services/user/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'wid-add-payment-method',
  templateUrl: './add-payment-method.component.html',
  styleUrls: ['./add-payment-method.component.scss']
})
export class AddPaymentMethodComponent implements OnInit, OnDestroy {
  form: FormGroup;
  action: string;
  company: string;
  companyId: string;
  language: string;
  languages = [];
  /** subscription */
  subscriptionModal: Subscription;
  private subscriptions: Subscription[] = [];
  constructor( private formBuilder: FormBuilder,
               private userService: UserService,
               @Inject(MAT_DIALOG_DATA) public data: any,
               private appInitializerService: AppInitializerService,
               public dialogRef: MatDialogRef<AddPaymentMethodComponent>,
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
    if (this.data) {
      this.action = 'update';
    } else {
      this.action = 'add';
    }
  }
  /**
   * @description : initialization of the form
   */
  initForm(): void {

    this.form = this.formBuilder.group({
      company: [{ value: this.company, disabled: true }],
      language: [this.data ? this.data.data.RefDataKey.language_id : ''],
      methodName : [this.data ? this.data.data.ref_data_desc : '', [Validators.required]],
      input: this.formBuilder.array(this.data ? this.data.list.map(data => this.formBuilder.group({
        lang: [data.RefDataKey.language_id],
        refDataDesc: [data.ref_data_desc]
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
      if (this.data) {
        this.updatePaymentMethod();
      } else {
        this.addPaymentMethod();

      }
    }
  }
  /**
   * @description  get list array input
   */
  getListPaymentMethods() {
    return this.form.get('input') as FormArray;
  }
  /**
   * @description  add translate
   */
  onAddAnotherTranslate() {
    return this.getListPaymentMethods().push(this.formBuilder.group({ lang: '', refDataDesc: '' }));
  }

  /**
   * @description: get languages
   */
  getLanguages(): void {
     this.language = this.userService.language.langId;
    this.languages = [];
    this.languages = this.appInitializerService.languageList.map((lang) => {
      return ({ value: lang._id, viewValue: lang.language_desc, selected: false });
    });
    this.languages.find(el => el.value === this.language).selected = true;
  }

  getValue(value, rang) {
    this.languages.find(el => el.value === value).selected = true;
  }

  /**
   * @description : add payment method
   */
  addPaymentMethod() {
    const methodPaymentTerms = {
      application_id: this.userService.applicationId,
      email_address: this.userService.emailAddress,
      company_id: this.companyId,
      ref_type_id: this.utilsService.getRefTypeId('PAYMENT_MODE'),
      language_id: this.language,
      ref_data_code: this.form.value.methodName.split(' ').join('').toUpperCase(),
      ref_data_desc: this.form.value.methodName
    };
    this.subscriptions.push(this.refdataService.addrefdata(methodPaymentTerms).subscribe(async (data) => {
      if (data) {
        console.log(data);
      }

      this.form.value.input.map((response) => {
        const methodPayment = {
          application_id: this.userService.applicationId,
          email_address: this.userService.emailAddress,
          company_id: this.companyId,
          ref_type_id: this.utilsService.getRefTypeId('PAYMENT_MODE'),
          language_id: response.lang,
          ref_data_code: this.form.value.methodName.split(' ').join('').toUpperCase(),
          ref_data_desc: response.refDataDesc
        };
        this.subscriptions.push(this.refdataService.addrefdata(methodPayment).subscribe((res) => {
          if (res) {
            console.log(res);
          }
        }));
      });
      this.refdataService
        .getRefDataByTypeDatatable(this.companyId, this.userService.applicationId, this.utilsService.getRefTypeId('PAYMENT_MODE'),
          this.userService.language.langId, 5, 0).subscribe((resp) => {
        this.dialogRef.close(resp);
      });
    }));

  }
  /**
   * @description : update payment method
   */
  updatePaymentMethod() {
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
      this.subscriptions.push(this.refdataService.updaterefdata(methodPaymentMethod).subscribe((data) => {
        if (data) {
        }
      }));
      /* update payment method desc with other languages and add it if is not exist */
    } else { let i = 0;
    this.form.value.input.map((desc) => {

      const PaymentMethodUpdated = {
        application_id: this.data.data.RefDataKey.application_id,
        email_address: this.data.data.RefDataKey.email_address,
        company_id: this.data.data.RefDataKey.company_id,
        ref_type_id: this.data.data.RefDataKey.ref_type_id,
        language_id: desc.lang,
        ref_data_code: this.data.data.RefDataKey.ref_data_code,
        ref_data_desc: desc.refDataDesc
      };
      if (i < this.data.list.length ) {
        this.subscriptions.push(this.refdataService.updaterefdata(PaymentMethodUpdated).subscribe((data) => {
          if (data) {
            i = i + 1;
          }
        }));
        this.dialogRef.close(true);
      } else {
        this.subscriptions.push(this.refdataService.addrefdata(PaymentMethodUpdated).subscribe((data) => {
          if (data) {
          }
        }));
      }
    });
    }
    this.dialogRef.close(true);

  }
  /**
   * @description destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }
}

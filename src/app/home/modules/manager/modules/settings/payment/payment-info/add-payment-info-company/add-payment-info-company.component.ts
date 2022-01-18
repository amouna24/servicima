import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ReplaySubject, Subscription } from 'rxjs';

import { UtilsService } from '@core/services/utils/utils.service';
import { UserService } from '@core/services/user/user.service';
import { CompanyPaymentTermsService } from '@core/services/companyPaymentTerms/company-payment-terms.service';

import { ICompanyModel } from '@shared/models/company.model';
import { IViewParam } from '@shared/models/view.model';

@Component({
  selector: 'wid-add-payment-info-company',
  templateUrl: './add-payment-info-company.component.html',
  styleUrls: ['./add-payment-info-company.component.scss'],
})
export class AddPaymentInfoCompanyComponent implements OnInit, OnDestroy {
  form: FormGroup;
  action: string;
  company: ICompanyModel;
  languages: IViewParam[] = [];
  addOrUpdateForm: string;
  public filteredLanguage = new ReplaySubject(1);
  /** subscription */
  subscriptionModal: Subscription;
  private subscriptions: Subscription[] = [];
  constructor(public dialogRef: MatDialogRef<AddPaymentInfoCompanyComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder,
              private utilsService: UtilsService,
              private companyPaymentTermsService: CompanyPaymentTermsService,
              private userService: UserService, ) {
  }

  ngOnInit(): void {
    this.userService.connectedUser$.subscribe(
      (userInfo) => {
        if (userInfo) {
          this.company = userInfo['company'];
        }
      });
    this.initForm();
     if (this.data) {
       this.action = 'update';
       this.addOrUpdateForm = 'SETTINGS_UPDATE_PAYMENT_TERM';
       this.setForm();
     } else {
       this.action = 'add';
       this.addOrUpdateForm = 'SETTINGS_ADD_PAYMENT_TERM';
     }
  }

  /**
   * @description : initialization of the form
   */
  initForm(): void {
    this.form = this.formBuilder.group({
      paymentTermsCode: [''],
      paymentTermsDesc: ['', [Validators.required]],
      delay: ['', [Validators.required]],
      endOfMonthFlag: [''],
    });
  }
  /**
   * @description : set the value of the form if it was an update user
   */
   setForm() {
     this.form.setValue({
       paymentTermsDesc: this.data.payment_terms_desc,
       paymentTermsCode: this.data.companyPaymentTermsKey.payment_terms_code,
       delay: this.data.delay,
       endOfMonthFlag: this.data.end_of_month_flag === 'Y'
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
        const paymentTermsCompany = {
          application_id: this.userService.applicationId,
          company_email: this.userService.emailAddress,
          payment_terms_code: this.data.companyPaymentTermsKey.payment_terms_code,
          payment_terms_desc: this.form.value.paymentTermsDesc,
          delay: this.form.value.delay,
          end_of_month_flag: this.form.value.endOfMonthFlag ? 'Y' : 'N'
        };
        this.subscriptions.push(this.companyPaymentTermsService.updateCompanyPaymentTerms(paymentTermsCompany).subscribe(() => {
          this.dialogRef.close(true);
        }));
      } else {
      const paymentTermsCompany = {
        application_id: this.userService.applicationId,
        company_email: this.userService.emailAddress,
        payment_terms_code:  `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-PAYMENT_TERMS`,
        payment_terms_desc: this.form.value.paymentTermsDesc,
        delay: this.form.value.delay,
        end_of_month_flag: this.form.value.endOfMonthFlag ? 'Y' : 'N'
      };
        this.subscriptions.push(this.companyPaymentTermsService.addCompanyPaymentTerms(paymentTermsCompany).subscribe((paymentTerms) => {
        if (paymentTerms) {
          this.subscriptions.push( this.companyPaymentTermsService.getCompanyPaymentTerms(this.userService.emailAddress).subscribe((data) => {
            this.dialogRef.close(data);
          }));
        }

      }));
    }
  }
  }
  /**
   * @description destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }
}

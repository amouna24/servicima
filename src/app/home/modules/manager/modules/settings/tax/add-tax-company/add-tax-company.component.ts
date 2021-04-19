import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ReplaySubject, Subscription } from 'rxjs';

import { UserService } from '@core/services/user/user.service';
import { CompanyTaxService } from '@core/services/companyTax/companyTax.service';

import { ICompanyModel } from '@shared/models/company.model';
import { IViewParam } from '@shared/models/view.model';

@Component({
  selector: 'wid-add-tax-company',
  templateUrl: './add-tax-company.component.html',
  styleUrls: ['./add-tax-company.component.scss']
})
export class AddTaxCompanyComponent implements OnInit , OnDestroy {
  action: string;
  form: FormGroup;
  company: ICompanyModel;
  languages: IViewParam[] = [];

  public filteredLanguage = new ReplaySubject(1);

  /** subscription */
  subscriptionModal: Subscription;
  private subscriptions: Subscription[] = [];
  constructor(public dialogRef: MatDialogRef<AddTaxCompanyComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private companyTaxService: CompanyTaxService, ) {
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
      this.setForm();
    } else {
      this.action = 'add';
    }
  }

  /**
   * @description : initialization of the form
   */
  initForm(): void {
    this.form = this.formBuilder.group({
      startingDate: ['', [Validators.required]],
      taxRate: ['', [Validators.required]],
      description: ['', [Validators.required]],
      fiscalComment: [''],
      inactiveDate: [''],
    });
  }
  /**
   * @description : set the value of the form if it was an update user
   */
  setForm() {
    this.form.setValue({
      startingDate: this.data.companyTaxKey.tax_start_date,
      taxRate: this.data.tax_rate,
      fiscalComment: this.data.tax_comment,
      description: this.data.tax_desc,
      inactiveDate: this.data.tax_inactive_date ? this.data.tax_inactive_date : null
  });
    this.form.controls['startingDate'].disable();
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
        const taxCompany = {
          application_id: this.userService.applicationId,
          company_email: this.userService.emailAddress,
          tax_code: this.data.companyTaxKey.tax_code,
          tax_start_date: this.data.companyTaxKey.tax_start_date,
          tax_desc: this.form.value.description,
          tax_rate: this.form.value.taxRate,
          tax_inactive_date: this.form.value.inactiveDate,
          tax_comment: this.form.value.fiscalComment
        };
        this.subscriptions.push(this.companyTaxService.updateCompanyTax(taxCompany).subscribe((data) => {
          if (data) {
            this.dialogRef.close(true);
          }
        }));
      } else {
      const taxCompany = {
        application_id: this.userService.applicationId,
        company_email: this.userService.emailAddress,
        tax_code: `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-TC`,
        tax_start_date: this.form.value.startingDate,
        tax_desc: this.form.value.description,
        tax_rate: this.form.value.taxRate,
        tax_inactive_date: this.form.value.inactiveDate,
        tax_comment: this.form.value.fiscalComment

      };
        this.subscriptions.push(this.companyTaxService.addCompanyTax(taxCompany).subscribe((data) => {
      if (data) {
        this.subscriptions.push(this.companyTaxService.getCompanyTax(this.userService.emailAddress).subscribe((response) => {
        if (response) {
          this.dialogRef.close(response);
        }
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

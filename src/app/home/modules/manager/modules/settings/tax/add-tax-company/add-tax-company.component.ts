import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IViewParam } from '@shared/models/view.model';
import { ReplaySubject, Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalService } from '@core/services/modal/modal.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { UserService } from '@core/services/user/user.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { CompanyTaxService } from '@core/services/companyTax/companyTax.service';

@Component({
  selector: 'wid-add-tax-company',
  templateUrl: './add-tax-company.component.html',
  styleUrls: ['./add-tax-company.component.scss']
})
export class AddTaxCompanyComponent implements OnInit , OnDestroy {

  form: FormGroup;
  company;
  applicationId: string;
  languages: IViewParam[] = [];
  public filteredLanguage = new ReplaySubject(1);
  featureList = [];
  emailAddress: string;
  /** subscription */
  subscriptionModal: Subscription;
  private subscriptions: Subscription[] = [];
  constructor(public dialogRef: MatDialogRef<AddTaxCompanyComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private modalService: ModalService,
              private formBuilder: FormBuilder,
              private utilsService: UtilsService,
              private appInitializerService: AppInitializerService,
              private userService: UserService,
              private companyTaxService: CompanyTaxService,
              private localStorageService: LocalStorageService) {
  }

  ngOnInit(): void {
    const cred = this.localStorageService.getItem('userCredentials');
    this.applicationId = cred['application_id'];
    this.emailAddress = cred['email_address'];
    this.userService.connectedUser$.subscribe(
      (userInfo) => {
        if (userInfo) {
          this.company = userInfo['company'];
        }
      });
    this.initForm();
    if (this.data) {
      this.setForm();
    }
  }

  /**
   * @description : initialization of the form
   */
  initForm(): void {
    this.form = this.formBuilder.group({
      startingDate: ['', [Validators.required]],
      taxRate: ['', [Validators.required]],
      fiscalComment: ['', [Validators.required]],
      description: ['', [Validators.required]],
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
          application_id: this.applicationId,
          company_email: this.emailAddress,
          tax_code: this.data.companyTaxKey.tax_code,
          tax_start_date: this.data.companyTaxKey.tax_start_date,
          tax_desc: this.form.value.description,
          tax_rate: this.form.value.taxRate,
          tax_inactive_date: this.form.value.inactiveDate,
          tax_comment: this.form.value.fiscalComment
        };
        this.subscriptions.push(this.companyTaxService.updateCompanyTax(taxCompany).subscribe((data) => {
          if (data) {
            this.dialogRef.close();
          }
        }));
      } else {
      const taxCompany = {
        application_id: this.applicationId,
        company_email: this.emailAddress,
        tax_code: `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-TC`,
        tax_start_date: this.form.value.startingDate,
        tax_desc: this.form.value.description,
        tax_rate: this.form.value.taxRate,
        tax_inactive_date: this.form.value.inactiveDate,
        tax_comment: this.form.value.fiscalComment

      };
        this.subscriptions.push(this.companyTaxService.addCompanyTax(taxCompany).subscribe((data) => {
      if (data) {
        this.subscriptions.push(this.companyTaxService.getCompanyTax(this.emailAddress).subscribe((response) => {
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

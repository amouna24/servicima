import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IViewParam } from '@shared/models/view.model';
import { ReplaySubject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalService } from '@core/services/modal/modal.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { UserService } from '@core/services/user/user.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';

@Component({
  selector: 'wid-add-tax-company',
  templateUrl: './add-tax-company.component.html',
  styleUrls: ['./add-tax-company.component.scss']
})
export class AddTaxCompanyComponent implements OnInit {

  form: FormGroup;
  company;
  applicationId: string;
  languages: IViewParam[] = [];
  public filteredLanguage = new ReplaySubject(1);
  featureList = [];
  emailAddress: string;
  constructor(public dialogRef: MatDialogRef<AddTaxCompanyComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private modalService: ModalService,
              private formBuilder: FormBuilder,
              private utilsService: UtilsService,
              private appInitializerService: AppInitializerService,
              private userService: UserService,
              private localStorageService: LocalStorageService) {
  }

  ngOnInit(): void {
    const cred = this.localStorageService.getItem('userCredentials');
    const language = this.localStorageService.getItem('language').langId;
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
      description: this.data.tax_desc
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
      const taxCompany = {
        application_id: this.applicationId,
        company_email: this.emailAddress,
        tax_code: 'tax code',
        tax_start_date: this.form.value.startingDate,
        tax_desc: this.form.value.description,
        tax_rate: this.form.value.taxRate,
        tax_inactive_date: 'tax inactive',
        tax_comment: this.form.value.fiscalComment

      };
      console.log(taxCompany, 'dhiiiiiiiiia');
    }
  }

}

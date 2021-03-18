import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
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
  selector: 'wid-add-payment-info-company',
  templateUrl: './add-payment-info-company.component.html',
  styleUrls: ['./add-payment-info-company.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class AddPaymentInfoCompanyComponent implements OnInit {
  form: FormGroup;
  company;
  applicationId: string;
  emailAddress: string;
  languages: IViewParam[] = [];
  public filteredLanguage = new ReplaySubject(1);
  featureList = [];

  constructor(public dialogRef: MatDialogRef<AddPaymentInfoCompanyComponent>,
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
      paymentTermsCode: ['', [Validators.required]],
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
          application_id: this.applicationId,
          company_email: this.emailAddress,
          payment_terms_code: this.data.companyPaymentTermsKey.payment_terms_code,
          payment_terms_desc: this.form.value.paymentTermsDesc,
          delay: this.form.value.delay,
          end_of_month_flag: this.form.value.endOfMonthFlag ? 'Y' : 'N'
        };
        console.log(paymentTermsCompany, 'update');
      } else {
      const paymentTermsCompany = {
        application_id: this.applicationId,
        company_email: this.emailAddress,
        payment_terms_code: 'payment code',
        payment_terms_desc: this.form.value.paymentTermsDesc,
        delay: this.form.value.delay,
        end_of_month_flag: this.form.value.endOfMonthFlag ? 'Y' : 'N'
      };
      console.log(paymentTermsCompany, 'tax company');
    }
  }
  }
}

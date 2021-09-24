import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProfileService } from '@core/services/profile/profile.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { InvoiceService } from '@core/services/invoice/invoice.service';
import { UserService } from '@core/services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'wid-set-pwd-invoice',
  templateUrl: './set-pwd-invoice.component.html',
  styleUrls: ['./set-pwd-invoice.component.scss']
})
export class SetPwdInvoiceComponent implements OnInit , OnDestroy {
  form: FormGroup;
  hidePassword = true;
  errorPwd: string;
  private subscriptions: Subscription[] = [];
  i = 0;
  userCredentials: string;

  constructor(private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private profileService: ProfileService,
              private localStorageService: LocalStorageService,
              private invoiceService: InvoiceService,
              private userService: UserService,
              private router: Router,
              public  dialogRef: MatDialogRef<SetPwdInvoiceComponent>) { }

  /**
   * @description Loaded when component in init state
   */
  ngOnInit(): void {
    this.initForm();
  }

  /**
   * @description : initialization of the form
   */
  initForm(): void {
    this.form = this.formBuilder.group({
        password: ['',
          // Password Field is Required
          Validators.required,
          // check whether the entered password has a number
          // check whether the entered password has a lower-case letter
          // check whether the entered password has upper-case letter
          // Has a minimum length of 8 characters and max length 30
          // Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z].{8,}')
        ],

      },
    );
  }

  /**
   * @description Check if the new password and the confirm password are matched
   */
  passwordValidator(form: FormGroup) {
    const condition = form.get('password').value !== form.get('confirmPassword').value;
    return condition ? { passwordsDoNotMatch: true } : null;
  }

  /**
   * @description Change password
   * @param form: form
   */
  changePassword(form: FormGroup): void {
    this.userCredentials = this.localStorageService.getItem('userCredentials');
    const invoiceHeader = {
      application_id: this.data.InvoiceHeaderKey.application_id,
      company_email: this.data.InvoiceHeaderKey.company_email,
      invoice_nbr: this.data.InvoiceHeaderKey.invoice_nbr,
      invoice_status: this.data.invoice_status,
      factor_involved: this.data.factor_involved,
      invoice_date: this.data.invoice_date,
      invoice_delay: this.data.invoice_delay,
      contractor_code: this.data.code,
      contract_code: this.data.contract_code,
      vat_amount: this.data.vat_amount,
      invoice_total_amount: this.data.invoice_total_amount,
      invoice_currency: this.data.invoice_currency,
      invoice_amount: this.data.invoice_amount,
      comment1: this.data.comment1,
      comment2: this.data.comment2,
      attachment: this.data.attachment,
      password: this.form.value.password,
      old_password: this.form.value.password,
    };
    this.invoiceService.updatePwdInvoiceHeader(invoiceHeader).subscribe((data) => {
        this.dialogRef.close(true);
      }, error => {
        console.error(error);
        this.i++;
        this.errorPwd = 'Password not valid';
        this.form.reset();
        if (this.i === 3) {
          this.dialogRef.close(false);
        }
      }
    );
  }
  focusFunction() {
    this.errorPwd = '';
  }

  onNotify(res: boolean): void {
    if (!res) {
      this.dialogRef.close();
    } else {
      this.changePassword(this.form);
    }
  }

  /**
   * @description destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }

}

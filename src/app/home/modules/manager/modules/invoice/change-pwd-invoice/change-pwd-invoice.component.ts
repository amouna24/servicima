import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrossFieldErrorMatcher } from '@core/services/utils/validatorPassword';
import { Subscription } from 'rxjs';
import { ProfileService } from '@core/services/profile/profile.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { AuthService } from '@widigital-group/auth-npm-front';
import { UserService } from '@core/services/user/user.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InvoiceService } from '@core/services/invoice/invoice.service';

@Component({
  selector: 'wid-change-pwd-invoice',
  templateUrl: './change-pwd-invoice.component.html',
  styleUrls: ['./change-pwd-invoice.component.scss']
})
export class ChangePwdInvoiceComponent implements OnInit , OnDestroy {

  form: FormGroup;
  existForm = true;
  hidePassword = true;
  hideConfirmPassword = true;
  hideOldPassword = true;
  errorMatcher = new CrossFieldErrorMatcher();
  private subscriptions: Subscription[] = [];
  userCredentials: string;
  modelConfig = {
    title: '',
    button: {
      buttonRight: {
        visible: true,
        name: 'save',
        color: '#f3f6f9',
        background: '#0067e0',
        nextValue: true,
        validator: true,
      },
      buttonLeft: {
        visible: true,
        name: 'cancel',
        color: '#232323',
        background: '#f3f6f9',
        nextValue: false,
        validator: false,
      },
    },
    style: {
    }
  };

  constructor(private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private profileService: ProfileService,
              private localStorageService: LocalStorageService,
              private invoiceService: InvoiceService,
              private userService: UserService,
              private router: Router,
              public  dialogRef: MatDialogRef<ChangePwdInvoiceComponent>) { }

  /**
   * @description Loaded when component in init state
   */
  ngOnInit(): void {
    this.initForm();
    console.log(this.data, 'change ');
  }

  /**
   * @description : initialization of the form
   */
  initForm(): void {
    this.form = this.formBuilder.group({
        password: ['', [
          // Password Field is Required
          Validators.required,
          // check whether the entered password has a number
          // check whether the entered password has a lower-case letter
          // check whether the entered password has upper-case letter
          // Has a minimum length of 8 characters and max length 30
          // Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z].{8,}')
        ]],

        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: this.passwordValidator
      });
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
      application_id: this.data[0].InvoiceHeaderKey.application_id,
      company_email: this.data[0].InvoiceHeaderKey.company_email,
      invoice_nbr: this.data[0].InvoiceHeaderKey.invoice_nbr,
      invoice_status: this.data[0].invoice_status,
      factor_involved: this.data[0].factor_involved,
      invoice_date: this.data[0].invoice_date,
      invoice_delay: this.data[0].invoice_delay,
      contractor_code: this.data[0].code,
      contract_code: this.data[0].contract_code,
      vat_amount: this.data[0].vat_amount,
      invoice_total_amount: this.data[0].invoice_total_amount,
      invoice_currency: this.data[0].invoice_currency,
      invoice_amount: this.data[0].invoice_amount,
      comment1: this.data[0].comment1,
      comment2: this.data[0].comment2,
      attachment: this.data[0].attachment,
      password: this.form.value.password,
    };
    this.invoiceService.updatePwdInvoiceHeader(invoiceHeader).subscribe((data) => {
        this.dialogRef.close();
      }, error => {
        alert('error , try it later');
        console.error(error);
        this.dialogRef.close();
      }
    );
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

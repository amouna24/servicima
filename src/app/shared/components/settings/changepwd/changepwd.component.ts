import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { CredentialsService } from '@core/services/credentials/credentials.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { CrossFieldErrorMatcher } from '@core/services/utils/validatorPassword';

@Component({
  selector: 'wid-changepwd',
  templateUrl: './changepwd.component.html',
  styleUrls: ['./changepwd.component.scss']
})
export class ChangePwdComponent implements OnInit {
  form: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  hideOldPassword = true;
  errorMatcher = new CrossFieldErrorMatcher();
  userCredentials: string;

  constructor(private formBuilder: FormBuilder,
              private credentialsService: CredentialsService,
              private  localStorageService: LocalStorageService,
              public dialogRef: MatDialogRef<ChangePwdComponent>) { }

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
      oldPassword: ['', [Validators.required]],
      password: ['', [
        // Password Field is Required
        Validators.required,
        // check whether the entered password has a number
        // check whether the entered password has a lower-case letter
        // check whether the entered password has upper-case letter
        // Has a minimum length of 8 characters and max length 30
        Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}$/),
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
   * @description CLose the dialog OnNoClick function
   */
  onClose(): void {
    this.dialogRef.close();
  }

  /**
   * @description Change password
   * @param form: form
   */
  changePassword(form: FormGroup): void {
    this.userCredentials = this.localStorageService.getItem('userCredentials');
    const newPassword = {
      application_id: this.userCredentials ['application_id'] ,
      email_address: this.userCredentials['email_address'],
      password: form.get('password').value,
      old_password: form.get('oldPassword').value,
      updated_by: this.userCredentials['email_address'],
    };
    this.credentialsService.changePassword(newPassword).subscribe(
      () => {
        this.dialogRef.close();
      },
      error => {
        alert('error , try it later');
        console.error(error);
        this.dialogRef.close();
      }
    );
  }
}

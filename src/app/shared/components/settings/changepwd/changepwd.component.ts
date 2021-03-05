import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { CrossFieldErrorMatcher } from '@core/services/utils/validatorPassword';
import { ProfileService } from '@core/services/profile/profile.service';
import { AuthService } from '@widigital-group/auth-npm-front';
import { UserService } from '@core/services/user/user.service';

// import { AuthService } from '../../../../../../projects/auth-front-lib/src/public-api';

@Component({
  selector: 'wid-changepwd',
  templateUrl: './changepwd.component.html',
  styleUrls: ['./changepwd.component.scss']
})
export class ChangePwdComponent implements OnInit, OnDestroy {
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
      buttonLeft: {
        visible: true,
        name: 'save',
        color: '#f3f6f9',
        background: '#0067e0'
      },
      buttonRight: {
        visible: true,
        name: 'cancel',
        color: '#232323',
        background: '#f3f6f9'
      },
    },
    style: {
    }
  };

  constructor(private formBuilder: FormBuilder,
              private profileService: ProfileService,
              private localStorageService: LocalStorageService,
              private authService: AuthService,
              private userService: UserService,
              private router: Router,
              public  dialogRef: MatDialogRef<ChangePwdComponent>) { }

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
    const newPassword = {
      application_id: this.userCredentials ['application_id'] ,
      email_address: this.userCredentials['email_address'],
      password: form.get('password').value,
      old_password: form.get('oldPassword').value,
      updated_by: this.userCredentials['email_address'],
    };
    this.subscriptions.push(this.profileService.changePassword(newPassword).subscribe(
      () => {
        this.subscriptions.push(this.authService.logout().subscribe(() => {
            localStorage.removeItem('userCredentials');
            localStorage.removeItem('currentToken');
            this.userService.connectedUser$.next(null);
            this.router.navigate(['/auth/login']);
            this.dialogRef.close();
          },
          (err) => {
            console.error(err);

          }));
      },
      error => {
        alert('error , try it later');
        console.error(error);
        this.dialogRef.close();
      }
    ));
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

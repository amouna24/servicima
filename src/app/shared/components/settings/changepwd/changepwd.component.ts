import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ProfileService } from '../../../../core/services/profile/profile.service';
import { CredentialsService } from '../../../../core/services/credentials/credentials.service';


/** Error when the parent is invalid */
class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control.dirty && form.invalid;
  }
}

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
  matchedPassword: boolean;
  errorMatcher = new CrossFieldErrorMatcher();

  constructor(private formBuilder: FormBuilder, private credentialsService: CredentialsService,
    public dialogRef: MatDialogRef<ChangePwdComponent>) { }

  formControl = new FormControl('', [
    Validators.required,
  ]);

  ngOnInit(): void {
    this.initForm();
  }


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



  changePassword(form: FormGroup) {
    const newPassword = {
      application_id: '5eac544a92809d7cd5dae21f',
      email_adress: 'walid.tenniche@widigital-group.com',
      password: form.get('password'),
      oldPassword: form.get('oldPassword'),
      updated_by: 'walid.tenniche@widigital-group.com',
    }
    this.credentialsService.changePassword(newPassword).subscribe(
      res => {
        console.log(res);
        this.dialogRef.close();
      },
      error => {
        alert('error , try it later');
        this.dialogRef.close();
      }
    )

  }


}
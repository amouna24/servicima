import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUserInfo } from '@shared/models/userInfo.model';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '@core/services/user/user.service';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'wid-training-add',
  templateUrl: './training-add.component.html',
  styleUrls: ['./training-add.component.scss']
})
export class TrainingAddComponent implements OnInit, OnDestroy {
  constructor(
      private location: Location,
      private formBuilder: FormBuilder,
      private userService: UserService,

  ) { }

  title = 'Add Training';
  form: FormGroup;
  companyEmail: string;
  userInfo: IUserInfo;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**************************************************************************
   * @description back click
   *************************************************************************/
  backClicked() {
    this.location.back();
  }

  ngOnInit(): void {
    this.initForm();
  }
  /**
   * @description : initialization of the form
   */
  initForm(): void {
    this.form = this.formBuilder.group({
      application_id: [''],
      email_address: [''],
      training_code: [''],
      title: ['', [Validators.required]],
      domain: ['', [Validators.required]],
      warned_number: [''],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      price: [''],
      hours: [''],
      description: ['', [Validators.required]],
      online: [''],
      organisation_code: [''],
    });
  }
  /**
   * @description Get connected user
   */
  getConnectedUser(): void {
    this.userService.connectedUser$.pipe(takeUntil(this.destroyed$))
        .subscribe(
            (userInfo) => {
              if (userInfo) {
                this.userInfo = userInfo['company'][0];
                this.companyEmail = userInfo['company'][0]['companyKey']['email_address'];
              }
            });
  }
  ngOnDestroy(): void {
  }

}

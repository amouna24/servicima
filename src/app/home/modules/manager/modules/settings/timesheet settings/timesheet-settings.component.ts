import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';

import { TimesheetSettingService } from '@core/services/timesheet-setting/timesheet-setting.service';
import { UserService } from '@core/services/user/user.service';
import { ICompanyTimesheetSettingModel } from '@shared/models/CompanyTimesheetSetting.model';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '@core/services/modal/modal.service';

@Component({
  selector: 'wid-timesheet-management',
  templateUrl: './timesheet-settings.component.html',
  styleUrls: ['./timesheet-settings.component.scss']
})
export class TimesheetSettingsComponent implements OnInit , OnDestroy {
  form: FormGroup;
  companyTimesheetSetting: ICompanyTimesheetSettingModel;
  isLoading = new BehaviorSubject<boolean>(false);
  emailAddress: string;
  /** subscription */
  subscription: Subscription;
  private subscriptions: Subscription[] = [];
  constructor(private userService: UserService,
              private formBuilder: FormBuilder,
              private timesheetSettingService: TimesheetSettingService,
              private location: Location,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private modalService: ModalService, ) {
  }

  /**
   * @description Loaded when component in init state
   */
  ngOnInit(): void {
    this.getConnectedUser();
    this.getTimesheetSetting();
    this.initForm();
  }

  /**
   * @description Get connected user
   */
  getConnectedUser() {
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.emailAddress = userInfo['company'][0]['companyKey']['email_address'];
          }
        });
  }
  /**
   * @description : initialization of the form
   */
  initForm(): void {
    this.form = this.formBuilder.group({
      workingHoursDay: ['', [Validators.required]],
      workingHoursWeek: ['', [Validators.required]],
      sundayRate: ['', [Validators.required]],
      saturdayRate: ['', [Validators.required]],
      holidayRate: ['', [Validators.required]],
      overtimePerDayRate: ['', [Validators.required]],
    });
  }

  /**
   * @description get timesheet setting by company
   */
  getTimesheetSetting(): void {
    this.subscriptions.push(this.timesheetSettingService.getCompanyTimesheetSetting(this.emailAddress).subscribe((data) => {
      this.companyTimesheetSetting = data[0];
      this.setValue();
    }, error => console.error(error)));
  }

  /**
   * @description set value
   */
  setValue() {
    this.form.patchValue({
      workingHoursDay: this.companyTimesheetSetting.working_hour_day,
      sundayRate: this.companyTimesheetSetting.sunday_rate,
      saturdayRate: this.companyTimesheetSetting.saturday_rate,
      holidayRate: this.companyTimesheetSetting.holiday_rate,
      overtimePerDayRate: this.companyTimesheetSetting.overtime_per_day_rate,
    });
  }

  /**
   * @description back click
   */
  backClicked() {
    this.location.back();
  }

  /**
   * @description return to dashboard
   */
  cancel() {
    this.router.navigate(['../'], { relativeTo: this.activeRoute.parent });
  }

  /**
   * @description update timesheet setting
   */
  updateTimesheetSetting() {
    const timesheetSetting = {
      application_id: this.companyTimesheetSetting.CompanyTimesheetSettingKey.application_id,
      company_email: this.companyTimesheetSetting.CompanyTimesheetSettingKey.company_email,
      setting_code: this.companyTimesheetSetting.CompanyTimesheetSettingKey.setting_code,
      working_hour_day: this.form.value.workingHoursDay,
      sunday_rate: this.form.value.sundayRate,
      saturday_rate: this.form.value.saturdayRate,
      holiday_rate: this.form.value.holidayRate,
      overtime_per_day_rate: this.form.value.overtimePerDayRate,
    };
    const confirmation = {
      code: 'edit',
      title: 'timesheet.settings.title.modal',
      description: 'timesheet.settings.description.modal'
    };
    this.subscription = this.modalService.displayConfirmationModal(confirmation, '528px', '300px').subscribe((value) => {
      if (value === true) {
    this.subscriptions.push(this.timesheetSettingService.updateCompanyTimesheetSetting(timesheetSetting).subscribe((data) => {
     console.log(data,  'data');
    }, error => console.error(error)));
      }
      this.subscription.unsubscribe();
    });
  }

  /**
   * @description destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }

}

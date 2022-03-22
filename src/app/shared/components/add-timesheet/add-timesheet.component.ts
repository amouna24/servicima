import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TimesheetService } from '@core/services/timesheet/timesheet.service';
import { UserService } from '@core/services/user/user.service';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { IUserInfo } from '@shared/models/userInfo.model';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { HolidayService } from '@core/services/holiday/holiday.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '@core/services/modal/modal.service';
import { takeUntil } from 'rxjs/operators';
import { IContractProject } from '@shared/models/contractProject.model';
import { ContractsService } from '@core/services/contracts/contracts.service';
import { IContract } from '@shared/models/contract.model';
import { ITimesheetModel } from '@shared/models/timesheet.model';
import { IHoliday } from '@shared/models/holiday.model';
import _ from 'lodash';
const TIMESHEET_EXTRA = 'TIMESHEET_EXTRA';
const TIMESHEET = 'TIMESHEET';
@Component({
  selector: 'wid-add-timesheet',
  templateUrl: './add-timesheet.component.html',
  styleUrls: ['./add-timesheet.component.scss']
})

export class AddTimesheetComponent implements OnInit {
  initialForm: FormGroup;
  projectsList: IContractProject[];
  userInfo: IUserInfo;
  companyEmail: string;
  collaboratorEmail: string;
  isLoading = new BehaviorSubject<boolean>(false);
  timesheet: ITimesheetModel;
  date: Date;
  contract: IContract;
  holidays: IHoliday;
  private currentUser: any;
  availableFeature = [];
  weekDays: any[] = [];
  @Input() formType: { add: boolean, edit: boolean, type: string, managerMode?: boolean};
   /** @description Variable used to destroy all subscriptions */
  destroy$: Subject<boolean> = new Subject<boolean>();
  /** subscriptions */
  subscriptionModal: Subscription;
  subscriptions: Subscription;
  startDateFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    return day === 1;
  };

  constructor(private fb: FormBuilder,
              private timesheetService: TimesheetService,
              private userService: UserService,
              private refDataService: RefdataService,
              private utilService: UtilsService,
              private location: Location,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private modalServices: ModalService,
              private contractService: ContractsService,
              private holidayServices: HolidayService
  ) {
    this.getUserConnected();
  }

  async ngOnInit() {
    this.weekDays = this.holidayServices.weekDays;
    this.getData().then((res) => this.isLoading.next(res));
  }
  /**
   * @description: Get the needed data for the form
   */
  getData(): Promise<boolean> {
    let done = false;
    return new Promise(
      resolve => {
        try {
          if (this.formType.add) {
            this.getUserInfo();
            this.getContracts().then((res) => {
              this.contract = res;
              this.getProjects();
              this.createForm();
              done = true;
              resolve(done);
            });
          } else if (this.formType.edit) {
            this.getTimesheetById(atob(this.activeRoute.snapshot.queryParams.id)).then(
              (data) => {
                this.timesheet = data;
                this.companyEmail = data.TimeSheetKey.company_email;
                this.collaboratorEmail = data.TimeSheetKey.email_address;
                this.getContracts().then((res) => {
                  this.contract = res;
                  this.getProjects(res.contractKey.contract_code);
                  this.createForm();
                  this.updateForm();
                  done = true;
                  resolve(done);
                });
              }
            );
          }
        } catch (e) {
          console.error(e);
        }
      });
  }
  /**
   * @description: get Timesheet by id
   * @param: id
   * @return: Timesheet Promise<ITimesheetModel>
   */
  getTimesheetById(id: string): Promise<ITimesheetModel> {
    let timesheet: ITimesheetModel;
    return new Promise(
      resolve => {
        this.timesheetService.getTimesheet(`?_id=${id}`).subscribe(
          (data) => {
            timesheet = data[0];
            resolve(timesheet);
          });
      }
    );
  }
  /**
   * @description : get Collaborator contract
   * @return : collaborator contract Promise<IContract>
   */
  getContracts(): Promise<IContract> {
    return new Promise((resolve) => {
      this.contractService.getContracts(
        `?collaborator_email=${this.collaboratorEmail}` +
        `&email_address=${this.companyEmail}` +
        `&contract_start_date[$lte]=${new Date()}` +
        `&contract_end_date[$gte]=${new Date()}`
      ).subscribe(
        (data) => {
            const res = data['results'][0];
            resolve(res);
        });
    });
  }

  /**
   * @description : get Project
   */
  getProjects(contractCode?: string): void {
    if (!contractCode) {
      if (this.contract) {
        this.contractService.getContractProject(`?contract_code=${this.contract.contractKey.contract_code}`).subscribe(
          (res) => {
            this.projectsList = res['results'];
          }
        );
      }
    } else {
      this.contractService.getContractProject(`?contract_code=${contractCode}`).toPromise().then(
        (res) => {
          this.projectsList = res['results'] ;
        }
      );
    }
  }

  /**
   * @description : get user info
   */
  getUserInfo() {
    this.collaboratorEmail = this.userService.emailAddress;
    this.subscriptions = this.userService.connectedUser$.subscribe(
      (data) => {
        if (!!data) {
          this.companyEmail = data.user[0]['company_email'];
        }
      });
  }

  /**
   * @description : initialize empty form
   */
  createForm() {
    const dayValidator = [
      Validators.min(0),
      Validators.max( !!this.contract ? Number(this.contract.working_hour_day) : 8),
      Validators.required
    ];

    this.initialForm = this.fb.group(
      {
        application_id: this.userService.applicationId,
        email_address: this.userService.emailAddress,
        company_email: this.companyEmail,
        project_code: [{ value: '', disabled: this.formType.edit}, [Validators.required]],
        start_date: [{ value: '', disabled: this.formType.edit}, [Validators.required]],
        end_date: [''],
        timesheet_status: [''],
        comment: [''],
        monday: ['', dayValidator],
        tuesday: ['', dayValidator],
        wednesday: ['', dayValidator],
        thursday: ['', dayValidator],
        friday: ['', dayValidator],
        saturday: ['', dayValidator],
        sunday: ['', dayValidator],
        total_week_hours: [this.totalWeekHours()],
        type_timesheet: this.formType.type,
      }
    );
  }

  /**
   * @description : update form timesheet
   */
  updateForm() {
    this.initialForm.patchValue({
      application_id: this.timesheet.TimeSheetKey.application_id,
      email_address: this.timesheet.TimeSheetKey.email_address,
      company_email: this.timesheet.TimeSheetKey.company_email,
      end_date: this.timesheet.end_date,
      project_code: this.timesheet.TimeSheetKey.project_code,
      start_date: this.timesheet.TimeSheetKey.start_date,
      timesheet_status: this.timesheet.timesheet_status,
      comment: this.timesheet.comment,
      monday: this.timesheet.monday,
      tuesday: this.timesheet.tuesday,
      wednesday: this.timesheet.wednesday,
      thursday: this.timesheet.thursday,
      friday: this.timesheet.friday,
      saturday: this.timesheet.saturday,
      sunday: this.timesheet.sunday,
      type_timesheet: this.formType.type,
      total_week_hours: this.timesheet.total_week_hours,
    });
    this.getWeekHoliday();
  }

  /**
   * @description : submit timesheet, save as draft or approve
   * @param value: 'submit' or 'save'
   */
  async submitTimesheet(value) {
    if (this.initialForm.valid) {
      let endDate;
      if (this.formType.add) {
        endDate = new Date(this.initialForm.value.start_date);
        endDate.setDate(endDate.getDate() + 7);
      }
      const statut = () => {
        if (value === 'submit') {
          return 'PENDING';
        } else if (value === 'save') {
          return 'DRAFT';
        } else if (value === 'approve' && this.formType.managerMode) {
          return 'APPROVED';
        }
      };
      await this.initialForm.patchValue({
        timesheet_status: statut(),
        total_week_hours: this.totalWeekHours(),
        end_date: this.formType.add ? endDate : this.timesheet.end_date
      });
      const confirmation = this.modalData('add', `${value} timesheet`, `Are you sure you want to ${value} your timesheet?`);
      this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          if (res === true) {
            if (this.formType.add) {
              this.addTimesheet();
            } else if (this.formType.edit) {
              this.updateTimesheet();
            }
          }
          this.subscriptionModal.unsubscribe();
        });
    }
  }

  /**
   * @description : Add timesheet
   */
  addTimesheet(): void {
    this.timesheetService.addTimesheet(this.initialForm.getRawValue()).pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      (data) => {
         this.router.navigate(['/collaborator/timesheet/', this.formType.type]);
      }
    );
  }

  /**
   * @description : Update timesheet
   */
  async updateTimesheet() {
    this.timesheetService.updateTimesheet(this.initialForm.getRawValue()).pipe(
      takeUntil(this.destroy$)
    ).toPromise().then(
      (data) => {
        if (this.formType.managerMode) {
          this.router.navigate(['/manager/timesheet/PENDING']);
        } else {
          this.router.navigate(['/collaborator/timesheet/', this.formType.type]);
        }
      },
    (err) => {
      console.log(err);
    }
    );
  }

  /**
   * @description : calcul total hours of the week
   */
  totalWeekHours(): number {
    const weekDays = [
      this.initialForm?.value.monday,
      this.initialForm?.value.tuesday,
      this.initialForm?.value.wednesday,
      this.initialForm?.value.thursday,
      this.initialForm?.value.friday,
      this.initialForm?.value.saturday,
      this.initialForm?.value.sunday
    ];
    let total = 0;
    weekDays.map(
      (day) => {
        if (day) {
          total = total + day;
        }
      }
    );
    return total;
  }

  /**
   * @description back click
   */
  backClicked(): void {
    this.location.back();
  }
  /**
   * @description: Validate day
   * @param: input
   * @return: error message or void
   */
  dayValidator(formControlName: string): string | void {
    if (this.initialForm.controls[formControlName]?.errors?.required) {
      return 'Required field';
    } else if (this.initialForm.controls[formControlName]?.errors?.max) {
      return `The number of hours must be ${this.contract.working_hour_day} or less`;
    } else if (this.initialForm.controls[formControlName]?.errors?.min) {
      return 'The number of hours must be at least 0 ';
    }
  }
  /**
   * @description: Set modal data
   * @param: modal code, modal title and modal description
   * @return: any
   */
  modalData(code: string, title: string, description: string): any {
    return { code, title, description};
}
  /**
   * @description: Get timesheet week holidays
   * @return: void
   */
  getWeekHoliday(): void {
      this.holidayServices.getWeekHoliday(
        'FR',
        this.formType.add ? this.initialForm.value.start_date : this.timesheet.TimeSheetKey.start_date
      ).then(
        (res) => {
          this.weekDays = res;
          this.disableHolidayInput();
        }
      );
  }
  /**
   * @description: check if the day is holiday
   * * @param: day number (the week start with monday = 0)
   * @return: number
   */
  checkDay(i: number): number {
    const day = this.weekDays[i].name;
    if (this.weekDays[i].hasHoliday) {
      if (this.initialForm.controls[day].enabled) {
        this.initialForm.controls[day].disable();
      }
      return Number(this.contract.working_hour_day);
    } else {
      if (this.initialForm.controls[day].disabled && this.checkFeature(this.getFeature())) {
        this.initialForm.controls[day].enable();
      }
      return !!this.initialForm.value[day] ? this.initialForm.value[day] : '';
    }
  }
  /**
   * @description: Disable the input holidays
   */
  disableHolidayInput(): void {
    if (this.formType.type !== TIMESHEET_EXTRA) {
      this.initialForm.patchValue({
        monday: this.checkDay( 0),
        tuesday: this.checkDay(1),
        wednesday: this.checkDay(2),
        thursday: this.checkDay( 3),
        friday: this.checkDay(4),
        saturday: this.checkDay( 5),
        sunday: this.checkDay( 6),
      });
    }
  }
  getUserConnected() {
    this.availableFeature = _.intersection(this.userService.licenceFeature, this.userService.companyRolesFeatures[0]);
    this.currentUser = {
      features: this.availableFeature
    };
  }
  checkFeature(feature): boolean {
    if (!this.userService.licenceFeature.includes(feature)) {
      return false;
    }
    return this.currentUser &&
      this.currentUser.features &&
      this.currentUser.features.includes(feature);
  }
  getFeature(): string {
    if (this.formType.add ) {
      return  this.formType.type === TIMESHEET ?
        'TIMESHEET_ADD' : 'TIMESHEET_EXTRAS_ADD';
    } else {
      return  this.formType.type === TIMESHEET ?
        'TIMESHEET_UPDATE' : 'TIMESHEET_EXTRAS_UPDATE' ;
    }
  }
  getActionFeautre(action: string): string {
    const timesheet = this.formType.type === TIMESHEET;
    switch (action) {
      case ('approve'):
        return timesheet ? 'TIMESHEET_APPROVE' : 'TIMESHEET_EXTRAS_APPROVE';
      case ('submit'):
        return timesheet ? 'TIMESHEET_SUBMIT' : 'TIMESHEET_EXTRAS_SUBMIT';
      case ('save'):
        return timesheet ? 'TIMESHEET_SAVE' : 'TIMESHEET_EXTRAS_SAVE';
      case ('update'):
        return timesheet ? 'TIMESHEET_UPDATE' : 'TIMESHEET_EXTRAS_UPDATE';
    }
  }
}

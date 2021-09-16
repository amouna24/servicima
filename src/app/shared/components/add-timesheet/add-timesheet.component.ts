import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TimesheetService } from '@core/services/timesheet/timesheet.service';
import { UserService } from '@core/services/user/user.service';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { IUserInfo } from '@shared/models/userInfo.model';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '@core/services/modal/modal.service';
import { takeUntil } from 'rxjs/operators';
import { IContractProject } from '@shared/models/contractProject.model';
import { ContractsService } from '@core/services/contracts/contracts.service';
import { IContract } from '@shared/models/contract.model';
import { ITimesheetModel } from '@shared/models/timesheet.model';
import { holidaysList } from '@shared/statics/holidays-list.static';
import { IHoliday } from '@shared/models/holiday.model';
import {  MatDatepickerInputEvent } from '@angular/material/datepicker';
const TIMESHEET_EXTRA = 'TIMESHEET_EXTRA';
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
              private contractService: ContractsService
  ) {
  }

  async ngOnInit() {
    this.holidays = holidaysList.find(row => row.country === 'FR');
    this.initWeekDay();
    this.getData();
  }
  getData() {
    try {
      if (this.formType.add) {
        this.getUserInfo();
        this.getContracts().then((res) => {
          this.contract = res;
          this.getProjects();
          this.createForm();
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
              this.getMonthHoliday();
            });
          }
        );
      }
    } catch (e) {
      console.error(e);
    }
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
            this.projectsList = res;
          }
        );
      }
    } else {
      this.contractService.getContractProject(`?contract_code=${contractCode}`).toPromise().then(
        (res) => {
          this.projectsList = res ;
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
   * @description : create empty form
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
        type_timesheet: [{ value: '', disabled: true}],
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
      project_code: this.timesheet.TimeSheetKey.project_code,
      start_date: this.timesheet.TimeSheetKey.start_date,
      end_date: this.timesheet.end_date,
      timesheet_status: this.timesheet.timesheet_status,
      comment: this.timesheet.comment,
      monday: this.timesheet.monday,
      tuesday: this.timesheet.tuesday,
      wednesday: this.timesheet.wednesday,
      thursday: this.timesheet.thursday,
      friday: this.timesheet.friday,
      saturday: this.timesheet.saturday,
      sunday: this.timesheet.sunday,
      total_week_hours: this.timesheet.total_week_hours,
    });
  }

  /**
   * @description : submit timesheet or save as draft
   * @param value: 'submit' or 'save'
   */
  async submitTimesheet(value) {
    if (this.initialForm.valid) {
      const endDate = new Date(this.initialForm.value.start_date);
      endDate.setDate(endDate.getDate() + 7);
      const statut = () => {
        if (value === 'submit') {
          return 'Pending';
        } else if (value === 'save') {
          return 'Draft';
        } else if (value === 'approve') {
          return 'Approved';
        }
      };
      await this.initialForm.patchValue({
        timesheet_status: statut(),
        type_timesheet: this.formType.type,
        total_week_hours: this.totalWeekHours(),
        end_date: endDate
      });
      const confirmation = this.modalData('add', `${value} timesheet`, `Are you sure you want to ${value} your timesheet?`);
      this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          if (res === true) {
            if (this.formType.add) {
              console.log('add', this.initialForm.value);
              this.addTimesheet();
            } else if (this.formType.edit) {
              console.log('update', this.initialForm.value);
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
    this.timesheetService.addTimesheet(this.initialForm.value).pipe(
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
  updateTimesheet(): void {
    this.timesheetService.updateTimesheet(this.initialForm.value).pipe(
      takeUntil(this.destroy$)
    ).toPromise().then(
      (data) => {
        if (this.formType.managerMode) {
          this.router.navigate(['/manager/timesheet/Pending']);
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
      return `maximum value is ${this.contract.working_hour_day}`;
    } else if (this.initialForm.controls[formControlName]?.errors?.min) {
      return 'maximum value is 0';
    }
  }

  modalData(code: string, title: string, description: string): any {
    return { code, title, description};
}

  initWeekDay() {
    this.weekDays = [
      {
        formControlName: 'monday',
        desc: 'Monday',
        holiday: null,
        hasHoliday: false,
      },
      {
        formControlName: 'tuesday',
        desc: 'Tuesday',
        holiday: null,
        hasHoliday: false,
      },
      {
        formControlName: 'wednesday',
        desc: 'Wednesday',
        holiday: null,
        hasHoliday: false,
      },
      {
        formControlName: 'thursday',
        desc: 'Thursday',
        holiday: { },
        hasHoliday: false,
      },
      {
        formControlName: 'friday',
        desc: 'Friday',
        holiday: { },
        hasHoliday: false,
      },
      {
        formControlName: 'saturday',
        desc: 'Saturday',
        holiday: null,
        hasHoliday: false,
      },
      {
        formControlName: 'sunday',
        desc: 'Sunday',
        holiday: null,
        hasHoliday: false,
      }
    ];
  }

  getMonthHoliday() {
    if (this.initialForm.value.start_date) {
      const date = this.initialForm.value.start_date;
      const firstDay = new Date(date);
      const lastDay = new Date(date);
      this.initWeekDay();
      lastDay.setDate(firstDay.getDate() + 6);
      const monthHolidays = this.holidays.holidays.filter(
        (day) => {
          return (Number(day.month) === (firstDay.getMonth() + 1) ||
            Number(day.month) === (lastDay.getMonth() + 1));
        }
      );
      let dd: any;
      for (let i = 0; i < 7; i++) {
        const dateDay = new Date(date);
        dateDay.setDate(dateDay.getDate() + i);
        dd = monthHolidays.find((res) => Number(res.day) === dateDay.getDate());
        this.weekDays[i].holiday = dd ? dd : null;
        this.weekDays[i].hasHoliday = !!dd;
      }
      this.disableHolidayInput();
    }
  }
  disableHolidayInput() {
    if (this.formType.type !== TIMESHEET_EXTRA) {
      const verif = (day, i) => {
        if (this.weekDays[i].hasHoliday) {
          this.initialForm.controls[day].disable();
          return 0;
        } else {
          this.initialForm.controls[day].enable();
          return this.initialForm.value[day];
        }
      };
      this.initialForm.patchValue({
        monday: verif('monday', 0),
        tuesday: verif('tuesday', 1),
        wednesday: verif('wednesday', 2),
        thursday: verif('thursday', 3),
        friday: verif('friday', 4),
        saturday: verif('saturday', 5),
        sunday: verif('sunday', 6),
      });
    }
  }
}

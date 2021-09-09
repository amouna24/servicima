import { Component, OnInit } from '@angular/core';
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
  companyId: string;
  languageId: string;
  isLoading = new BehaviorSubject<boolean>(false);
  typeTimesheet: string;
  timesheet: ITimesheetModel;
  date: Date;
  contract: IContract;
  addForm: boolean;
  /**************************************************************************
   * @description Variable used to destroy all subscriptions
   *************************************************************************/
  destroy$: Subject<boolean> = new Subject<boolean>();
  /** subscription */
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
    this.getUserInfo();
    this.getContracts().then((data) => {
      this.contract = data;
      this.getProjects();
      this.createForm();
    }).finally(
      () => {
        this.getFormType();
        this.isLoading.next(true);
      });
  }
  /**
   * @description : Get form type Add or Edit
   */
  getFormType(): void {
    this.typeTimesheet = this.activeRoute.snapshot.params.type;
    this.addForm = this.activeRoute.snapshot.params.action === 'add';
    if (!this.addForm) {
      this.getTimesheetById(this.activeRoute.snapshot.queryParams.id).then(
        (data) => {
          this.timesheet = data;
          this.updateForm();
        }
      );
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
        `?collaborator_email=${this.userService.emailAddress}` +
        `&email_address=${this.companyEmail}` +
        `&contract_start_date[$lte]=${new Date()}` +
        `&contract_end_date[$gte]=${new Date()}`
      ).subscribe(
        (data) => {
          const res = data['results'][0];
          resolve(res);
        }
      );
    });
  }

  /**
   * @description : get Project
   */
  getProjects(contractCode?: string): void {
    if (!contractCode) {
      this.contractService.getContractProject(`?contract_code=${this.contract.contractKey.contract_code}`).subscribe(
        (res) => {
          this.projectsList = res;
        }
      );
    } else {
      this.contractService.getContractProject(`?contract_code=${contractCode}`).subscribe(
        (res) => {
          this.initialForm.patchValue({ project_code: res[0].project_desc});
        }
      );
    }
  }

  /**
   * @description : get user info
   */
  getUserInfo() {
    this.subscriptions = this.userService.connectedUser$.subscribe(
      (data) => {
        if (!!data) {
          this.companyEmail = data.user[0]['company_email'];
          this.languageId = data.user[0].language_id;
        }
      });
  }

  /**
   * @description : create empty form
   */
  createForm() {
    const dayValidator = [
      Validators.min(0),
      Validators.max(Number(this.contract.working_hour_day)),
      Validators.required
    ];

    this.initialForm = this.fb.group(
      {
        application_id: this.userService.applicationId,
        email_address: this.userService.emailAddress,
        company_email: this.companyEmail,
        project_code: ['', [Validators.required]],
        start_date: ['', [Validators.required]],
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
        type_timesheet: [''],
      }
    );
  }

  /**
   * @description : update form timesheet
   */
  updateForm() {
    this.initialForm.patchValue({
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
      await this.initialForm.patchValue({
        timesheet_status: value === 'submit' ? 'Pending' : 'save' ? 'Draft' : '',
        type_timesheet: this.typeTimesheet,
        total_week_hours: this.totalWeekHours(),
        end_date: endDate
      });
      const confirmation = this.modalData('add', `${value} timesheet`, `Are you sure you want to ${value} your timesheet?`);
      this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          if (res === true) {
            if (this.addForm) {
              this.addTimesheet();
            } else {
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
        this.router.navigate(['/collaborator/timesheet/', this.typeTimesheet]);
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
       this.router.navigate(['/collaborator/timesheet/', this.typeTimesheet]);
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
    weekDays.forEach(
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
  dayValidator(input: AbstractControl): string | void {
    if (input?.errors?.required) {
      return 'Required field';
    } else if (input?.errors?.max) {
      return `maximum value is ${this.contract.working_hour_day}`;
    } else if (input?.errors?.min) {
      return 'maximum value is 0';
    }
  }

  modalData(code: string, title: string, description: string): any {
    return { code, title, description};
}
}

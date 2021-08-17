import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TimesheetService } from '@core/services/timesheet/timesheet.service';
import { UserService } from '@core/services/user/user.service';
import { Subject, Subscription } from 'rxjs';
import { IUserInfo } from '@shared/models/userInfo.model';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { IViewParam } from '@shared/models/view.model';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '@core/services/modal/modal.service';
import { takeUntil } from 'rxjs/operators';
import { IContractProject } from '@shared/models/contractProject.model';
import { ContractsService } from '@core/services/contracts/contracts.service';
import { IContract } from '@shared/models/contract.model';

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
  companyId: string;
  languageId: string;
  refData: { } = { };
  categoryList: IViewParam[];
  projectName: string;
  projectCode: string;
  startDate: string;
  categoryCode = '';
  categoryViewValue: number ;
  timesheet = this.router.getCurrentNavigation().extras.state.data;
  addForm = this.router.getCurrentNavigation().extras.state.buttonClicked !== 'edit';
  typeTimesheet: string;
  date: Date;
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
    this.getTimesheetType();
    this.getUserInfo();
    this.createForm();
    this.getProjects();
    await this.getRefDataCategory();
    this.updateForm();
  }

  getTimesheetType(): void {
    this.typeTimesheet = this.activeRoute.snapshot.params.type;
  }

  getContracts(): Promise<IContract> {
    return new Promise(resolve => {
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
    } );
  }

  /**
   * @description : get Project
   */
  getProjects(contractCode?: string): void {
    if (!contractCode) {
      this.getContracts().then(
        (data) => {
          this.contractService.getContractProject(`?contract_code=${data.contractKey.contract_code}`).subscribe(
            (res) => {
                this.projectsList = res;
            }
          );
        }
      );
    } else {
          this.contractService.getContractProject(`?contract_code=${contractCode}`).subscribe(
            (res) => {
                this.projectName = res[0].project_desc;
                this.initialForm.patchValue({ project_code: this.projectName});
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
   * @description : get ref data
   */
  async getRefdata() {
    const list = ['TIMESHEET_STATE', 'TIMESHEET_PROJECT_CATEGORY'];
    this.refData = await this.refDataService
      .getRefData(this.utilService.getCompanyId(this.companyEmail, this.userService.applicationId), this.userService.applicationId, list, false);
    return this.refData;
  }

  /**
   * @description : get ref data category
   */
  async getRefDataCategory() {
    const data = await this.getRefdata();
    this.categoryList = data['TIMESHEET_PROJECT_CATEGORY'];
  }

  /**
   * @description : create form timesheet
   */
  createForm() {
    const dayValidator = [Validators.min(0), Validators.max(8), Validators.required];
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
        customer_timesheet: 'wid-customer-timesheet',
        collaborator_email: this.userService.emailAddress,
        language_id: this.languageId,
        company_id: this.utilService.getCompanyId('ALL', this.utilService.getApplicationID('ALL')),
      }
    );
  }

  /**
   * @description : update form timesheet
   */
  updateForm() {
    if (!this.addForm) {
      this.initialForm.patchValue({
        application_id: this.timesheet.TimeSheetKey.application_id,
        email_address: this.timesheet.TimeSheetKey.email_address,
        company_email: this.timesheet.TimeSheetKey.company_email,
        project_code: '',
        start_date: this.timesheet.start_date,
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
        customer_timesheet: this.timesheet.customer_timesheet,
      });
      this.projectCode = this.timesheet.TimeSheetKey.project_code;
      this.getProjects(this.projectCode);
    }
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
        type_timesheet: this.typeTimesheet ,
        total_week_hours: this.totalWeekHours(),
        end_date: endDate
      });
      console.log('finale', this.initialForm.value);
      const confirmation = {
        code: 'add',
        title: `${value} timesheet`,
        description: `Are you sure you want to ${value} your timesheet?`,
      };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          // ADD_TIMESHEET
          if (res === true) {
            this.timesheetService.addTimesheet(this.initialForm.value).pipe(
              takeUntil(this.destroy$)
            ).subscribe(
              (data) => {
                if (this.typeTimesheet === TIMESHEET) {
                  this.router.navigate(['/collaborator/timesheet']);
                } else if (this.typeTimesheet === TIMESHEET_EXTRA) {
                  this.router.navigate(['/collaborator/timesheet'], { queryParams : { 'type_timesheet': 'extra'}});
                }

              },

              // ERROR
              (error) => {
                console.log('error', error);
              }
            );
          }
          this.subscriptionModal.unsubscribe();
        });
    }
  }

  /**
   * @description : update timesheet
   */
  editTimesheet() {
    if (this.initialForm.valid) {
      this.timesheet.application_id = this.timesheet.TimeSheetKey.application_id;
      this.timesheet.comment = this.initialForm.value.comment;
      this.timesheet.monday = this.initialForm.value.monday;
      this.timesheet.tuesday = this.initialForm.value.tuesday;
      this.timesheet.wednesday = this.initialForm.value.wednesday;
      this.timesheet.thursday = this.initialForm.value.thursday;
      this.timesheet.friday = this.initialForm.value.friday;
      this.timesheet.saturday = this.initialForm.value.saturday;
      this.timesheet.sunday = this.initialForm.value.sunday;
      this.timesheet.total_week_hours = this.initialForm.value.total_week_hours;

      const confirmation = {
        code: 'edit',
        title: 'edit your timesheet',
        description: 'Are you sure you want to edit your timesheet?'
      };
      this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '528px', '300px')
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          if (res === true) {
            this.timesheetService.updateTimesheet(this.timesheet).pipe(
              takeUntil(this.destroy$)
            ).subscribe(
              (data) => {
                console.log(data);
                this.router.navigate(['/collaborator/timesheet']);
              },
              error => console.log(error)
            );
          }
          this.subscriptionModal.unsubscribe();
        });
    }
  }

  /**
   * @description : delete timesheet
   */
  deleteTimesheet() {
    const confirmation = {
      code: 'delete',
      title: 'delete timesheet',
      description: `Are you sure you want to delete your timesheet?`,

    };

    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (res) => {
          if (res === true) {
            this.timesheetService.deleteTimesheet(this.timesheet._id)
              .pipe(
                takeUntil(this.destroy$)
              )
              .subscribe(
                (data) => {
                  console.log(data, 'data');
                  this.router.navigate(['/collaborator/timesheet']);
                }
              );
            this.subscriptionModal.unsubscribe();
          }
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
  backClicked() {
    this.location.back();
  }

  dayValidator(input: AbstractControl): string | void {
    if (input?.errors?.required) {
      return 'Required field';
    } else if (input?.errors?.max) {
      return 'maximum value is 8';
    } else if (input?.errors?.min) {
      return 'maximum value is 0';
    }
  }
}

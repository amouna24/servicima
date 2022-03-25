import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ITraining } from '@shared/models/training.model';
import { TrainingService } from '@core/services/training/training.service';
import { ITrainingSessionWeek } from '@shared/models/trainingSessionWeek.model';
import { dataAppearance } from '@shared/animations/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '@core/services/user/user.service';
import { IUserInfo } from '@shared/models/userInfo.model';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { UtilsService } from '@core/services/utils/utils.service';
import { IViewParam } from '@shared/models/view.model';

@Component({
  selector: 'wid-sessions-training',
  templateUrl: './sessions-training.component.html',
  styleUrls: ['./sessions-training.component.scss'],
  animations: [
    dataAppearance
  ]
})
export class SessionsTrainingComponent implements OnInit {
  title = 'Session List';
  training: ITraining;
  trainingCode = 'WID-27821-TR';
  showForm = false;
  trainingSessions: ITrainingSessionWeek[] = [];
  form: FormGroup;
  companyEmail: string;
  applicationId: string;
  userInfo: IUserInfo;
  weekDays: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  totalMinutesSessions = 0;
  timeDisplay: BehaviorSubject<string> = new BehaviorSubject<string>('00:00');

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
      private location: Location,
      private trainingService: TrainingService,
      private formBuilder: FormBuilder,
      private refDataService: RefdataService,
      private userService: UserService,
      private utilsService: UtilsService,

  ) {
    this.initForm();
  }
  async getData() {
    this.trainingService.getTraining(`?training_code=${this.trainingCode}`).subscribe((data) => {
      this.training = data['results'][0];
    });
    if (this.trainingSessions.length !== 0) {
    this.trainingSessions.map((t) => {
      const ar = t.durration.split(':');
      const hours = parseInt(ar[0], null);
      const minutes = parseInt(ar[1], null);
      this.totalMinutesSessions = this.totalMinutesSessions + this.convertTimeToMinute(hours, minutes);
    });
    }
  }

  async ngOnInit(): Promise<void> {
    await this.getConnectedUser();
    await this.getRefData();
    await this.getData();
  }
  /**************************************************************************
   * @description back click
   *************************************************************************/
  backClicked() {
    this.location.back();
  }
  /**************************************************************************
   * @description show form session
   *************************************************************************/
  showFormSession() {
    this.showForm = true;
  }
  /**
   * @description : initialization of the form
   */
  initForm(): void {
    this.form = this.formBuilder.group({
      application_id: [''],
      email_address: [''],
      training_code: [''],
      session_code: [''],
      day: [''],
      time: [''],
      durration: [''],
    });
  }
  /**
   * @description : initialization of the form
   */
  addSession() {
    const ar = this.form.value.durration.split(':');
    const total = this.convertTimeToMinute(parseInt(ar[0], null), parseInt(ar[1], null));
    const t = total + this.totalMinutesSessions;
    if (t <= this.training.warned_hours * 60) {
      this.trainingSessions.push({
        _id: '', status: '',
        TrainingSessionWeekKey: null,
        day: this.form.value.day,
        time: this.form.value.time,
        durration: this.form.value.durration
      });
      this.timeDisplay.next(this.displayTotalHours(t));
    } else {
      this.utilsService.openSnackBar('time invalid', 'close', 3000);
    }

  }
  /**
   * @description Get connected user
   */
  async getConnectedUser(): Promise<void> {
    this.userService.connectedUser$.pipe(takeUntil(this.destroyed$))
        .subscribe(
            (userInfo) => {
              if (userInfo) {
                this.userInfo = userInfo['company'][0];
                this.companyEmail = userInfo['company'][0]['companyKey']['email_address'];
                this.applicationId = userInfo['company'][0]['companyKey']['application_id'];
              }
            });
  }
 async getRefData() {
    await this.refDataService.getRefData(
        this.utilsService.getCompanyId(this.companyEmail, this.applicationId),
        this.applicationId,
        ['WEEK_DAYS']
    );
   this.weekDays.next(this.refDataService.refData['WEEK_DAYS']);

 }
  /**
   * @description : Convert Time to number
   * @Params hours
   * @Params minutes
   */
 convertTimeToMinute(hours: number, minutes: number): number {
   return hours * 60 + minutes;
 }
  /**
   * @description : next step of add training
   */
  next() {

  }
  /**
   * @description :  cancel function
   */
  cancel() {

  }

  /**
   * @description : display total hours
   */
  displayTotalHours(minutes: number): string {
    let totalHours = 0;
    let totalMinutes = minutes;
    while (totalMinutes > 60) {
      totalHours = totalHours + 1;
      totalMinutes = totalMinutes - 60;
    }
    let hoursString = totalHours.toString(null);
    let minutesString = totalMinutes.toString(null);
    if (totalHours < 10) {
      hoursString = '0' + hoursString;
    }
    if (totalMinutes < 10) {
      minutesString = '0' + minutesString;
    }
   return hoursString + ':' + minutesString;

  }

}

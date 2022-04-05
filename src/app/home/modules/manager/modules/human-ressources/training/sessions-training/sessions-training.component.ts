import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ITraining } from '@shared/models/training.model';
import { TrainingService } from '@core/services/training/training.service';
import { ITrainingSessionWeek } from '@shared/models/trainingSessionWeek.model';
import { dataAppearance } from '@shared/animations/animations';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { takeUntil } from 'rxjs/operators';
import { ModalService } from '@core/services/modal/modal.service';
import { UserService } from '@core/services/user/user.service';
import { IUserInfo } from '@shared/models/userInfo.model';
import { BehaviorSubject, forkJoin, ReplaySubject, Subject } from 'rxjs';
import { UtilsService } from '@core/services/utils/utils.service';
import { IViewParam } from '@shared/models/view.model';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { ProfileService } from '@core/services/profile/profile.service';
import * as _ from 'lodash';

import { InviteCollaboratorComponent } from '../invite-collaborator/invite-collaborator.component';

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
  listCollaborators: any;
  training: ITraining;
  showForm = false;
  trainingSessions: ITrainingSessionWeek[] = [];
  form: FormGroup;
  companyEmail: string;
  applicationId: string;
  userInfo: IUserInfo;
  weekDays: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  totalMinutesSessions: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  timeDisplay: BehaviorSubject<string> = new BehaviorSubject<string>('00:00');
  destroy$: Subject<boolean> = new Subject<boolean>();
  done = false;
  id = '';
  code = '';
  sessionCode: BehaviorSubject<string> = new BehaviorSubject<string>('');
  indexDay = { SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3, THURSDAY: 4, FRIDAY: 5, SATURDAY: 6};

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
      private location: Location,
      private trainingService: TrainingService,
      private formBuilder: FormBuilder,
      private userService: UserService,
      private router: Router,
      private modalService: ModalService,
      private localStorageService: LocalStorageService,
      private profileService: ProfileService,
      private refDataService: RefdataService,
      private utilsService: UtilsService,
      private route: ActivatedRoute,

  ) {
      this.route.queryParams
          .pipe(
              takeUntil(this.destroy$)
          )
          .subscribe( params => {
              if (params.id) {
                  this.id = atob(params.id);
                  this.code = atob(params.code);
                  this.getTrainingWithSessions(this.id, this.code);
              } else {
                  this.trainingService.getTraining(`?training_code=${atob(params.code)}`).subscribe((data) => {
                      this.training = data['results'][0];
                  });
              }

          });
    this.initForm();
  }
   getData() {

    if (this.trainingSessions.length !== 0) {
    this.trainingSessions.map((t) => {
      const ar = t.durration.split(':');
      const hours = parseInt(ar[0], null);
      const minutes = parseInt(ar[1], null);
      this.totalMinutesSessions.next(this.totalMinutesSessions.getValue() + this.convertTimeToMinute(hours, minutes));
    });
    }
  }

  async ngOnInit(): Promise<void> {
    this.modalService.registerModals(
        { modalName: 'inviteCollaborator', modalComponent: InviteCollaboratorComponent});
    await this.getConnectedUser();
    await this.getRefData();
    await this.getCollaborator();
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
      _id: ''
    });
  }
  /**
   * @description : initialization of the form
   */
  addSession() {
      if (this.form.value._id !== '') {
        const session =  this.trainingSessions
              .filter
              (x => x.TrainingSessionWeekKey.session_code === this.form.value.session_code)[0];
          const duration = session.durration.split(':');
          const totalDurr = this.convertTimeToMinute(parseInt(duration[0], null), parseInt(duration[1], null));
          const tot =  this.totalMinutesSessions.getValue() - totalDurr;
          this.totalMinutesSessions.next(tot);

      }
    const ar = this.form.value.durration.split(':');
    const total = this.convertTimeToMinute(parseInt(ar[0], null), parseInt(ar[1], null))
        * this.checkDateDay(this.training.start_date, this.training.end_date, this.form.value.day);
    console.log('my total ', total);
    if (total > 15) {
        const t = total + this.totalMinutesSessions.getValue();
        if (t <= this.training.warned_hours * 60) {
            if (this.form.value._id !== '') {
                this.trainingSessions
                    .filter
                    (x => x.TrainingSessionWeekKey.session_code === this.form.value.session_code)[0].day = this.form.value.day;
                this.trainingSessions
                    .filter
                    (x => x.TrainingSessionWeekKey.session_code === this.form.value.session_code)[0].time = this.form.value.time;
                this.trainingSessions
                    .filter
                    (x => x.TrainingSessionWeekKey.session_code === this.form.value.session_code)[0].durration = this.form.value.durration;
                this.totalMinutesSessions.next(t);
                this.timeDisplay.next(this.displayTotalHours(this.totalMinutesSessions.getValue()));

            } else {

                this.trainingSessions.push({
                    _id: '', status: 'ACTIVE',
                    TrainingSessionWeekKey: { application_id : this.applicationId,
                        email_address: this.companyEmail,
                        training_code: this.training.TrainingKey.training_code,
                        session_code: `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-SESSION`
                    },
                    day: this.form.value.day,
                    time: this.form.value.time,
                    durration: this.form.value.durration
                });
            }
            this.totalMinutesSessions.next(t);
            this.timeDisplay.next(this.displayTotalHours(t));
            this.resetForm();
        } else {
            this.utilsService.openSnackBar('time invalid', 'close', 3000);
        }
    } else {
        this.utilsService.openSnackBar('durration invalid', 'close', 3000);

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
      if (this.training.warned_hours * 60 === this.totalMinutesSessions.getValue()) {
          this.trainingSessions.map((session) => {
              if (session._id === '') {
                  this.trainingService.addTrainingSession({
                      application_id: this.applicationId,
                      email_address: this.companyEmail,
                      training_code: this.training.TrainingKey.training_code,
                      session_code: session.TrainingSessionWeekKey.session_code,
                      day: session.day,
                      time: session.time,
                      durration: session.durration
                  }).subscribe((data) => {
                      console.log('session added successfully');
                  });
              } else {
                  this.trainingService.updateTrainingSession(
                      {
                      application_id: this.applicationId,
                      email_address: this.companyEmail,
                      training_code: this.training.TrainingKey.training_code,
                      session_code: session.TrainingSessionWeekKey.session_code,
                      day: session.day,
                      time: session.time,
                      durration: session.durration
                  }).subscribe((data) => {
                      console.log('session added successfully');
                  });
              }

          });
          this.done = true;
      } else {
          this.utilsService.openSnackBar('you must complete session time');
      }

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
    while (totalMinutes > 59) {
      totalHours = totalHours + 1;
      totalMinutes = totalMinutes - 60;
    }
    let hoursString = '';
    let minutesString = '';
    totalHours < 10 ? hoursString = '0' + totalHours : hoursString = '' + totalHours;
    totalMinutes < 10 ? minutesString = '0' + totalMinutes : minutesString = '' + totalMinutes;
   return hoursString + ':' + minutesString;

  }
    /**
     * @description back to the main List
     */
  back(event) {
    this.router.navigate(['/manager/human-ressources/training/training-list']);
  }
    /**
     * @description Invite Collaborator
     */
  invite(event) {
    this.modalService.displayModal('inviteCollaborator', {
            listCollaborators: this.listCollaborators,
            training: this.training
        },
        '900px', '580px')
        .pipe(takeUntil(this.destroyed$))
        .subscribe(async (res) => {
          if (res) {
            console.log(res, 'res');
          }
        }, (error => {
          console.error(error);
        }));
  }
    /**
     * @description Get collaborator List
     */
    async getCollaborator() {
        const cred = this.localStorageService.getItem('userCredentials');
        this.applicationId = cred['application_id'];
        this.companyEmail = cred['email_address'];
        await this.refDataService.getRefData(
            this.utilsService.getCompanyId(this.companyEmail, this.applicationId),
            this.applicationId,
            ['PROF_TITLES']
        );
        this.profileService.getAllUser(this.companyEmail, 'COLLABORATOR')
            .subscribe(async data => {
                this.listCollaborators = data['results'].map(
                    (obj) => {
                        return {
                            _id: obj._id,
                            userKey: obj.userKey,
                            full_name: obj.first_name + ' ' + obj.last_name,
                            email_address: obj.userKey.email_address,
                            photo: obj.photo ?  obj.photo : null,
                            job_title: this.utilsService.getViewValue(obj.title_id, this.refDataService.refData['PROF_TITLES'])
                        };
                    });
                this.listCollaborators = _.orderBy(this.listCollaborators, [collab => collab.full_name.toLowerCase()], ['asc']);
            });
    }
    /**
     * @description Get Training sessions for update
     */
    getTrainingWithSessions(ID: string, code: string) {
        forkJoin([
            this.trainingService.getTraining(`?_id=${ID}`),
            this.trainingService.getTrainingSession(`?training_code=${code}`)
        ]).pipe(
            takeUntil(this.destroy$)
        ).subscribe(async (res) => {
            this.training = res[0]['results'][0];
            this.training = res[0]['results'][0];
            if (res[1]['results'] === []) {
            this.trainingSessions = [];
            } else {
            this.trainingSessions = res[1]['results'];
            this.getInitialTotalHours();
            this.showForm = true;
            }

        }, (error) => {
            console.log(error);
        });
    }

    /**
     * @description affiche total hours
     */
    getInitialTotalHours() {
        this.trainingSessions.map((session) => {
            const ar = session.durration.split(':');
            const total = this.convertTimeToMinute(parseInt(ar[0], null), parseInt(ar[1], null));
            console.log('my total ', total);
            const t = total + this.totalMinutesSessions.getValue();
            this.totalMinutesSessions.next(t);
        });
        console.log('get initial data ', this.totalMinutesSessions.getValue());
        this.timeDisplay.next(this.displayTotalHours(this.totalMinutesSessions.getValue()));

    }

    /**
     * @ description
     */
    resetForm() {
        this.form.get('application_id').setValue('');
        this.form.get('email_address').setValue('');
        this.form.get('session_code').setValue('');
        this.form.get('training_code').setValue('');
        this.form.get('day').setValue('');
        this.form.get('time').setValue('');
        this.form.get('durration').setValue('');
        this.form.get('_id').setValue('');
    }

    /**
     * @description check dates contains day
     */
    checkDateDay(dateStart: Date, dateEnd: Date, day: string) {
        const nbrStartDate = new Date(dateStart).getDay();
        const nbrEndDate = new Date(dateEnd).getDay();
        let existDay = this.weeksBetween(new Date(dateStart).getTime(), new Date(dateEnd).getTime());
        if ((this.indexDay[day] >= nbrStartDate) || ((this.indexDay[day] <= nbrEndDate))) {
            existDay = existDay + 1;
        }
        return existDay;
    }
    weeksBetween(d1: number, d2: number) {
        return Math.round((d2 - d1) / (7 * 24 * 60 * 60 * 1000));
    }

    /**
     * @description Update Date
     */
    updateHours(session: any) {
        console.log('my form ', this.form.value);
        if (this.form.value.session_code !== '') {
            this.utilsService.openSnackBar('you must submit your update', 'close', 3000);
        } else {
            console.log('get initaaaaaaaaa ', this.totalMinutesSessions.getValue());
            this.showForm = true;
            this.form.setValue({
                application_id: this.applicationId,
                email_address: this.companyEmail,
                training_code: session?.TrainingSessionWeekKey?.training_code,
                session_code: session?.TrainingSessionWeekKey?.session_code,
                day: session?.day,
                time: session?.time,
                durration: session?.durration,
                _id: session?._id
            });
            this.sessionCode.next(session?.TrainingSessionWeekKey?.session_code);
        }

    }

}

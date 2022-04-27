import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUserInfo } from '@shared/models/userInfo.model';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { TrainingService } from '@core/services/training/training.service';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { BehaviorSubject, forkJoin, Subject } from 'rxjs';
import { IViewParam } from '@shared/models/view.model';
import { UtilsService } from '@core/services/utils/utils.service';
import { takeUntil } from 'rxjs/operators';
import { ITraining } from '@shared/models/training.model';

@Component({
  selector: 'wid-training-add',
  templateUrl: './training-add.component.html',
  styleUrls: ['./training-add.component.scss']
})
export class TrainingAddComponent implements OnInit, OnDestroy {
    title = 'hr.training.trainingslist.sessioncreated.trainingsession';
    form: FormGroup;
    trainingCode = '';
    id = '';
    isLoading = new BehaviorSubject<boolean>(false);
    destroy$: Subject<boolean> = new Subject<boolean>();
    companyEmail: string;
    applicationId: string;
    userInfo: IUserInfo;
    domainList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
    trainingInfo: ITraining;
  constructor(
      private location: Location,
      private formBuilder: FormBuilder,
      private router: Router,
      private localStorageService: LocalStorageService,
      private trainingService: TrainingService,
      private refDataService: RefdataService,
      private utilsService: UtilsService,
      private route: ActivatedRoute,

  ) {
      this.getDataFromLocalStorage();
      this.initForm();
      this.route.queryParams
          .pipe(
              takeUntil(this.destroy$)
          )
          .subscribe( params => {
              if (params.id) {
                  this.trainingCode = atob(params.tc);
                  this.id = params.id;
                  this.getTrainingByID(this.id);
              }

          });
  }

  /**************************************************************************
   * @description back click
   *************************************************************************/
  backClicked() {
    this.location.back();
  }

  async ngOnInit(): Promise<void> {
    await this.getRefData();

  }
  /**
   * @description : initialization of the form
   */
  initForm(): void {
    this.form = this.formBuilder.group({
      application_id: [this.applicationId],
      email_address: [this.companyEmail],
      training_code: [`WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-TR`],
      title: ['', [Validators.required]],
      domain: ['', [Validators.required]],
      warned_number: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      price: [''],
      warned_hours: [''],
      description: ['', [Validators.required]],
      online: [''],
      organisation_code: [''],
    });
  }

  ngOnDestroy(): void {
  }

  /**
   * @description reset form
   */
  cancel() {
      if (this.id || this.id !== '') {
         this.updateForm(this.trainingInfo);
      } else {
          this.form.reset();

      }
  }

  /**
   * @description submit function
   */
  next() {
      if ( this.checkDate(this.form.value.start_date, this.form.value.end_date)) {
          if (this.id || this.id !== '') {
              this.trainingService.updateTraining(this.form.value).subscribe((data) => {
                  this.utilsService.openSnackBar('Training Updated successfully');
              });
          } else {
              this.trainingService.addTraining(this.form.value).subscribe((data) => {
                  console.log('my data ', data);
                  this.router.navigate(['/manager/human-ressources/training/session-training'],
                      {
                          queryParams: {
                              code: btoa(data['Training']['TrainingKey']['training_code'])
                          }
                      }
                  );

              });
          }
      } else {
          this.utilsService.openSnackBar('Check dates');
      }

  }
  /**
   * @description Get data from localstorage
   */
  getDataFromLocalStorage() {
    const cred = this.localStorageService.getItem('userCredentials');
    this.applicationId = cred['application_id'];
    this.companyEmail = cred['email_address'];
  }

    /**
     * @description get refdata
     */
  async getRefData() {
    await this.refDataService.getRefData(
        this.utilsService.getCompanyId(this.companyEmail, this.applicationId),
        this.applicationId,
        ['DOMAIN']
    );
    this.domainList.next(this.refDataService.refData['DOMAIN']);
  }

    /**
     * @description Get Training to be updated
     */
    getTrainingByID(ID: string) {
        this.isLoading.next(true);
        forkJoin([
            this.trainingService.getTraining(`?_id=${atob(ID)}`)
        ]).pipe(
            takeUntil(this.destroy$)
        ).subscribe(async (res) => {
            this.trainingInfo = res[0]['results'][0];
            console.log('my training info ', this.trainingInfo);
            this.updateForm(this.trainingInfo);
            this.isLoading.next(false);

        }, (error) => {
            console.log(error);
        });

    }

    /**
     * @description check date start and date end
     */
    checkDate(dateStart: Date, dateEnd: Date): boolean {
      if (dateStart.getTime() < dateEnd.getTime()) {
          return true;
      }
      return false;
    }

    /**
     * @description Update Form Training
     */
    updateForm(training: ITraining) {
         this.form.setValue({
             application_id: this.applicationId,
             email_address: this.companyEmail,
             training_code: training?.TrainingKey?.training_code,
             title: training?.title,
             domain: training?.domain,
             warned_number: training?.warned_number,
             start_date: training?.start_date,
             end_date: training?.end_date,
             price: training?.price,
             warned_hours: training?.warned_hours,
             description: training?.description,
             online: training?.online,
             organisation_code: training?.organisation_code,
         });
    }

}

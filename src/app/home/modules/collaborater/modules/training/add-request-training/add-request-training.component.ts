import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, forkJoin, ReplaySubject, Subject } from 'rxjs';
import { IViewParam } from '@shared/models/view.model';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '@core/services/user/user.service';
import { IUserInfo } from '@shared/models/userInfo.model';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { TrainingService } from '@core/services/training/training.service';
import { ITrainingRequest } from '@shared/models/trainingRequest.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'wid-add-request-training',
  templateUrl: './add-request-training.component.html',
  styleUrls: ['./add-request-training.component.scss']
})
export class AddRequestTrainingComponent implements OnInit {
  title = 'Add request';
  form: FormGroup;
  id = '';
  requestCode = '';
  isLoading = new BehaviorSubject<boolean>(false);
  destroy$: Subject<boolean> = new Subject<boolean>();
  companyEmail: string;
  emailAdress: string;
  applicationId: string;
  userInfo: IUserInfo;
  requestInfo: ITrainingRequest;
  domainList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
      private location: Location,
      private formBuilder: FormBuilder,
      private userService: UserService,
      private localStorageService: LocalStorageService,
      private refDataService: RefdataService,
      private utilsService: UtilsService,
      private trainingService: TrainingService,
      private route: ActivatedRoute,

  ) {
    this.initForm();
    this.route.queryParams
        .pipe(
            takeUntil(this.destroy$)
        )
        .subscribe( async params => {
          if (params.id) {
            this.requestCode = atob(params.rc);
            this.id = params.id;
            await this.getRequestById(this.id);
          }

        });
  }

  async ngOnInit(): Promise<void> {
    this.getDataFromLocalStorage();
    await this.getConnectedUser();

  }
  /**************************************************************************
   * @description back click
   *************************************************************************/
  backClicked() {
    this.location.back();
  }
  /**
   * @description : initialization of the form
   */
  initForm(): void {
    this.form = this.formBuilder.group({
      application_id: [''],
      email_address: [],
      request_code: [],
      collaborator_email: [''],
      title: ['', [Validators.required]],
      domain: ['', [Validators.required]],
      description: ['', [Validators.required]],
      send_date: [''],
      status_request: ['PENDING'],
      organisation_code: [''],
    });
  }
  /**
   * @description Get connected user
   */
  async getConnectedUser(): Promise<void> {
    this.userService.connectedUser$.pipe(takeUntil(this.destroyed$))
        .subscribe(
            async (userInfo) => {
              if (userInfo) {

                this.userInfo = userInfo['company'][0];
                this.companyEmail = userInfo['company'][0]['companyKey']['email_address'];
                this.applicationId = userInfo['company'][0]['companyKey']['application_id'];
                await this.getRefData();
              }
            });
  }
  /**
   * @description get connected user from local storage
   */
  getDataFromLocalStorage() {
    const cred = this.localStorageService.getItem('userCredentials');
    this.emailAdress = cred['email_address'];
    this.applicationId = cred['application_id'];
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
   * @description addOrUpdate
   */
  addOrUpdate() {
    if (this.id || this.id !== '') {
      if (this.form.valid) {
        this.trainingService.updateTraining(this.form.value).subscribe((data) => {
          this.utilsService.openSnackBar('Training Updated successfully');
        });
      }

    } else {
      if (this.form.valid) {
        this.form.value.application_id = this.applicationId;
        this.form.value.email_address = this .companyEmail;
        this.form.value.request_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-REQUEST`;
        this.form.value.collaborator_email = this.emailAdress;
        this.form.value.send_date = new Date();
        this.trainingService.addTrainingRequest(this.form.value).subscribe((data) => {
          this.utilsService.openSnackBar('Training request send successfully', 'close', 3000);
        });

      }
    }

  }

  /**
   * @description reset form
   */
  cancel() {
    if (this.id || this.id !== '') {
      this.updateForm(this.requestInfo);
    } else {
      this.form.reset();

    }
  }

  /**
   * @description Get Request to be updated
   */
  async getRequestById(ID: string) {
    this.isLoading.next(true);
    console.log('atobbbbbbb ', atob(ID));
    forkJoin([
      this.trainingService.getTrainingRequest(`?_id=${atob(ID)}`)
    ]).pipe(
        takeUntil(this.destroy$)
    ).subscribe(async (res) => {
      this.requestInfo = res[0]['results'][0];
      this.updateForm(this.requestInfo);
      this.isLoading.next(false);

    }, (error) => {
      console.log(error);
    });
  }
  /**
   * @description Update Form Training
   */
  updateForm(request: ITrainingRequest) {
    this.form.setValue({
      application_id: this.applicationId,
      email_address: this.companyEmail,
      request_code: request.TrainingRequestKey.request_code,
      collaborator_email: request.TrainingRequestKey.collaborator_email,
      title: request?.title,
      description: request?.description,
      send_date: request?.send_date,
      status_request: request?.status_request,
      domain: request?.domain,
      organisation_code: request?.organisation_code,
    });
  }

}

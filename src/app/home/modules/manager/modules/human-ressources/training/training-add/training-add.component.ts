import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUserInfo } from '@shared/models/userInfo.model';
import { Router } from '@angular/router';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { TrainingService } from '@core/services/training/training.service';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { BehaviorSubject } from 'rxjs';
import { IViewParam } from '@shared/models/view.model';
import { UtilsService } from '@core/services/utils/utils.service';

@Component({
  selector: 'wid-training-add',
  templateUrl: './training-add.component.html',
  styleUrls: ['./training-add.component.scss']
})
export class TrainingAddComponent implements OnInit, OnDestroy {
  constructor(
      private location: Location,
      private formBuilder: FormBuilder,
      private router: Router,
      private localStorageService: LocalStorageService,
      private trainingService: TrainingService,
      private refDataService: RefdataService,
      private utilsService: UtilsService,

  ) { }

  title = 'Add Training';
  form: FormGroup;
  companyEmail: string;
  applicationId: string;
  userInfo: IUserInfo;
  domainList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);

  /**************************************************************************
   * @description back click
   *************************************************************************/
  backClicked() {
    this.location.back();
  }

  async ngOnInit(): Promise<void> {
    this.getDataFromLocalStorage();
    this.initForm();
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
      warned_number: [''],
      start_date: [''],
      end_date: [''],
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
     this.form.reset();
  }

  /**
   * @description submit function
   */
  next() {
    console.log(this.form.valid);
    console.log('value ', this.form.value);
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
  /**
   * @description Get data from localstorage
   */
  getDataFromLocalStorage() {
    const cred = this.localStorageService.getItem('userCredentials');
    this.applicationId = cred['application_id'];
    this.companyEmail = cred['email_address'];
  }
  async getRefData() {
    await this.refDataService.getRefData(
        this.utilsService.getCompanyId(this.companyEmail, this.applicationId),
        this.applicationId,
        ['DOMAIN']
    );
    this.domainList.next(this.refDataService.refData['DOMAIN']);
  }

}

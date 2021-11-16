import { Component, Inject, OnInit } from '@angular/core';
import { forkJoin, ReplaySubject, Subject } from 'rxjs';
import { UserService } from '@core/services/user/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HumanRessourcesService } from '@core/services/human-ressources/human-resources.service';
import { takeUntil } from 'rxjs/operators';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { ILanguageModel } from '@shared/models/language.model';
import { UtilsService } from '@core/services/utils/utils.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ICollaborator } from '@shared/models/collaborator.model';
import { ProfileService } from '@core/services/profile/profile.service';
import { IUserModel } from '@shared/models/user.model';
import { IHrContract } from '@shared/models/hrContract.model';
@Component({
  selector: 'wid-request-work-certificate',
  templateUrl: './request-work-certificate.component.html',
  styleUrls: ['./request-work-certificate.component.scss']
})
export class RequestWorkCertificateComponent implements OnInit {

  companyEmail: string;
  emailAddress: string;
  applicationId: string;
  initialForm: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();
  languageList: ILanguageModel[];
  userInfo: IUserModel;
  contract: IHrContract;
  collaboratorInfo: ICollaborator;

  public filteredLanguage = new ReplaySubject(1);
  constructor(
    private hrService: HumanRessourcesService,
    private fb: FormBuilder,
    private userService: UserService,
    private utilsService: UtilsService,
    private appInitializer: AppInitializerService,
    private router: Router,
    private location: Location,
    private profileService: ProfileService,

  ) {
  }
  /**************************************************************************
   * @description Get connected user and initial data
   *************************************************************************/
  async ngOnInit(): Promise<void> {
    await this.getConnectedUser();
    await this.getInitialData(this.emailAddress);
    this.languageList = this.appInitializer.languageList;
    this.initialForm = this.fb.group({
      application_id: this.applicationId,
      company_email: this.companyEmail,
      email_address: this.emailAddress,
      certification_code: `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-WC`,
      request_type : ['', Validators.required],
      language : ['', Validators.required],
      comment : ['']
    });
  }
  /**************************************************************************
   * @description Go to the previous route
   *************************************************************************/
  backClicked() {
    this.location.back();
  }
  /**************************************************************************
   * @description Send request to add certificate
   *************************************************************************/

  request() {
    if (this.initialForm.valid) {
      if (this.contract !== null) {
        const  certeficate = {
          full_name: this.userInfo.first_name + ' ' + this.userInfo.last_name,
          contract_start_date : this.contract.contract_start_date,
          contract_end_date: this.contract.contract_end_date,
          salary: this.contract.contract_rate,
          nationality_id: this.collaboratorInfo.nationality_id,
          request_date: new Date(),
          request_status: 'Pending',
          address: this.collaboratorInfo.adress,
          language: this.initialForm.controls.language.value,
          title_id: this.userInfo.title_id,
          contract_type: this.contract.HRContractKey.contract_type,
          gender_id: this.userInfo.gender_id
        };
        this.hrService.addWorkCertificate(
          { ...this.initialForm.value, ...certeficate}).pipe(
          takeUntil(this.destroy$)
        ).subscribe((data) => {
            this.utilsService.openSnackBar('Certification added successfully', 'close', 5000);
            this.router.navigate(
              ['/collaborator/work-certificates'],
            );
          },
          (error) => {
            this.utilsService.openSnackBar('something wrong', 'close', 5000);
          });
      } else {
        this.utilsService.openSnackBar('you must have a contract', 'close', 5000);

      }

    }
  }
  /**************************************************************************
   * @description Get connected user
   *************************************************************************/
  async getConnectedUser() {
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.companyEmail = userInfo['user'][0]['company_email'];
            this.emailAddress = userInfo['user'][0]['userKey']['email_address'];
            this.applicationId = userInfo['user'][0]['userKey']['application_id'];
          }
        });
  }
  /**************************************************************************
   * @description Get initial data
   *************************************************************************/
  async getInitialData(email: string) {
    const url = `?email_address=${email}`;
    forkJoin([
      this.profileService.getUserByEmail(this.emailAddress),
      this.hrService.getContract(`?email_address=${this.companyEmail}&collaborator_email=${this.emailAddress}`),
      this.hrService.getCollaborators(url)
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res[0]['msg_code'] === '0004') {
          this.userInfo = null;

        } else {
          this.userInfo = res[0]['results'][0];
        }
        if (res[1]['msg_code'] === '0004') {
          this.contract = null;
        } else {

          this.contract = res[1][0];
        }
        if (res[2]['msg_code'] === '0004') {
          this.collaboratorInfo = null;
        } else {
          this.collaboratorInfo = res[2][0];
        }
      });

  }
}

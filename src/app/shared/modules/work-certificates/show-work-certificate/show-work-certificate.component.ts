import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IUserModel } from '@shared/models/user.model';
import { HumanRessourcesService } from '@core/services/human-ressources/human-resources.service';
import { UserService } from '@core/services/user/user.service';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { UtilsService } from '@core/services/utils/utils.service';
// tslint:disable-next-line:origin-ordered-imports
import { LocalStorageService } from '@core/services/storage/local-storage.service';
// tslint:disable-next-line:origin-ordered-imports
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { ModalService } from '@core/services/modal/modal.service';
import { forkJoin, Subject, Subscription } from 'rxjs';
import { SignatureCertificateComponent } from '@shared/modules/work-certificates/signature-certificate/signature-certificate.component';
import { IUserInfo } from '@shared/models/userInfo.model';
import { IViewParam } from '@shared/models/view.model';
import {  dataAppearance, showBloc } from '@shared/animations/animations';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'wid-show-work-certificate',
  templateUrl: './show-work-certificate.component.html',
  styleUrls: ['./show-work-certificate.component.scss'],
  animations: [
    dataAppearance,
    showBloc
  ]
})
export class ShowWorkCertificateComponent implements OnInit {

  @Input() collaborator: boolean;
  @Input() _id: string;
  certificate: any;
  nationality = '';
  user: IUserModel;
  position: string;
  requestType: string;
  show = true;
  showBtnEdit = 'Edit';
  refData = { };
  role = 'Collaborator';
  modals = { modalName: 'signature', modalComponent: SignatureCertificateComponent };
  subscriptionModal: Subscription;
  applicationId: string;
  companyId: string;
  companyEmail: string;
  emailAddress: string;
  companyName: string;
  infoUser: IUserInfo;
  nationalitiesList: IViewParam[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();

  /**************************************************************************
   * @description get initial data
   *************************************************************************/
  constructor(
    private hrService: HumanRessourcesService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private refDataService: RefdataService,
    private utilsService: UtilsService,
    private location: Location,
    private router: Router,
    private modalService: ModalService,

  ) {

  }
  /**************************************************************************
   * @description init form
   *************************************************************************/
  async ngOnInit(): Promise<void> {
      await this.getWorkCertificate(this._id);
    await this.getConnectedUser();
    this.modalService.registerModals(this.modals);
    await  this.getRefData();
  }
    /**************************************************************************
     * @description Get work certification
     * @Param ID
     *************************************************************************/
    async getWorkCertificate(ID) {
    forkJoin([
      this.hrService.getWorkCertificate(ID)
    ])
        .pipe(
            takeUntil(this.destroy$),
        )
        .subscribe(async res => {
     this.certificate = await res[0]['results'][0];
            if (this.certificate.request_type === 'CERT') {
                this.requestType = 'rh_title_certif';
            } else { this.requestType = 'rh_exp_certif'; }
        });
  }
  /**************************************************************************
   * @description get Ref data
   *************************************************************************/
  async getRefData() {
    /********************************** REF DATA **********************************/
    this.refData = await this.refDataService.getRefData(
      this.utilsService.getCompanyId(
        this.companyEmail, this.localStorageService.getItem('userCredentials')['application_id']),
      this.localStorageService.getItem('userCredentials')['application_id'],
      ['PROF_TITLES'],
      false
    );
    this.position = this.refData['PROF_TITLES'].filter(x => x.value === this.certificate.title_id)[0].viewValue;

    this.utilsService
      .getNationality(this.utilsService
        .getCodeLanguage( this.localStorageService.getItem('language')['langId'])).map((nationality) => {
      this.nationalitiesList.push({ value: nationality.NATIONALITY_CODE, viewValue: nationality.NATIONALITY_DESC });
    });
    if (this.certificate.nationality_id) {
      this.nationality = this.nationalitiesList.filter(x => x.value === this.certificate.nationality_id)[0].viewValue;
    }
  }
  /**************************************************************************
   * @description confirm certification
   *************************************************************************/
  confirm() {
    this.certificate.request_status = 'Confirmed';
    this.certificate.application_id = this.localStorageService.getItem('userCredentials')['application_id'];
    this.certificate.response_date = new Date();
    // tslint:disable-next-line:max-line-length
    this.hrService.updateWorkCertificate(this.certificate).subscribe((data) => { this.utilsService.openSnackBar('certificate confirmed successfully', 'close', 5000); },
      (err) => {
        this.utilsService.openSnackBar('something wrong', 'close', 5000);      }
    );
  }
  /**************************************************************************
   * @description reject certification
   *************************************************************************/
  reject() {
    this.certificate.request_status = 'Rejected';
    this.certificate.response_date = new Date();
    this.certificate.application_id = this.localStorageService.getItem('userCredentials')['application_id'];
    // tslint:disable-next-line:max-line-length
    this.hrService.updateWorkCertificate(this.certificate).subscribe((data) => { this.utilsService.openSnackBar('certeficate rejected', 'close', 5000); },
      (err) => {
        this.utilsService.openSnackBar('something wrong', 'close', 5000);
      }
    );
  }
  /**************************************************************************
   * @description  navigate to update certification
   *************************************************************************/
  update() {
    this.router.navigate(
      ['/collaborator/work-certificates/editCertif'],
        { queryParams: {
            idCertif: btoa(this._id)
          }
        });
  }
  /**
   * @description: get connected user
   */
  async  getConnectedUser(): Promise<void> {
    const cred = this.localStorageService.getItem('userCredentials');
    this.applicationId = cred['application_id'];
    this.emailAddress = cred['email_address'];
    this.userService.connectedUser$.subscribe(async (data) => {
      if (!!data) {
        this.infoUser = data;
        this.companyName = data['company'][0]['company_name'];
        this.companyId = data['company'][0]['_id'];
        this.companyEmail = data['company'][0]['companyKey']['email_address'];
      }
    });
  }

  /**************************************************************************
   * @description back click
   *************************************************************************/
  backClicked() {
    this.location.back();
  }
  /**************************************************************************
   * @description on sign click
   *************************************************************************/
  sign(event: Event) {

    this.subscriptionModal = this.modalService.displayModal('signature', this.certificate, '600px', '450px')
      .subscribe(
        (res) => {
          console.log('signature dialog', res);
        });

  }

}

import { Component, OnInit } from '@angular/core';
import { IUserModel } from '@shared/models/user.model';
import { HumanRessourcesService } from '@core/services/human-ressources/human-resources.service';
import { UserService } from '@core/services/user/user.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { ILanguageModel } from '@shared/models/language.model';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { IUserInfo } from '@shared/models/userInfo.model';
import {  dataAppearance } from '@shared/animations/animations';
import { IViewParam } from '@shared/models/view.model';

@Component({
  selector: 'wid-edit-work-certificate',
  templateUrl: './edit-work-certificate.component.html',
  styleUrls: ['./edit-work-certificate.component.scss'],
  animations: [
    dataAppearance,
  ]
})
export class EditWorkCertificateComponent implements OnInit {

  certificate: any;
  user: IUserModel;
  position: string;
  requestType: string;
  show = false;
  showBtnEdit = 'Edit';
  refData = { };
  role = 'Collaborator';
  editForm: FormGroup;
  languageList: ILanguageModel[];
  collaborator = false;
  applicationId: string;
  companyId: string;
  companyEmail: string;
  emailAddress: string;
  companyName: string;
  infoUser: IUserInfo;
  nationalitiesList: IViewParam[] = [];

  constructor(

    private hrService: HumanRessourcesService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private refDataService: RefdataService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private appInitializer: AppInitializerService,
    private location: Location,
    private router: Router,

  ) {
    this.getData();
  }
  /**************************************************************************
   * @description on keyup button confirm appear
   *************************************************************************/
  onKey(event: any) {
    this.show = true;
  }
  /**************************************************************************
   * @description Initialize Form
   *************************************************************************/
  async initForm(certificate: any) {
    this.editForm = this.formBuilder.group({
      contract_start_date: [certificate.contract_start_date ? certificate.contract_start_date : '' ],
      contract_end_date: [certificate.contract_end_date ? certificate.contract_end_date : '' ],
      address: [certificate.address ? certificate.address : ''],
      nationality_id: [certificate.nationality_id ? certificate.nationality_id : ''],
      request_date: [certificate.request_date ? certificate.request_date : '' ],
      request_response: [certificate.request_response ? certificate.request_response : '' ],
      request_status: [certificate.request_status ? certificate.request_status : ''],
      request_type: [certificate.request_type ? certificate.request_type : ''],
      language: [certificate.language ? certificate.language : ''],
      comment: [certificate.comment ? certificate.comment : '' ]

    });

  }
  /**************************************************************************
   * @description Initialize data
   *************************************************************************/
  async ngOnInit() {
    this.languageList = this.appInitializer.languageList;
    await this.getConnectedUser();
    await this.initForm(this.certificate);
    this.editForm.controls['request_date'].disable();
    this.editForm.controls['request_response'].disable();
    this.editForm.controls['request_status'].disable();
    this.editForm.controls['request_type'].disable();
    // this.editForm.controls['language'].disable();
    if (this.certificate.request_type === 'CERT') {
      this.requestType = 'rh_title_certif';
    } else { this.requestType = 'rh_exp_certif'; }
    await  this.getRefData();
    console.log('my certificate want to updated ', this.certificate);
  }
  /**************************************************************************
   * @description Confirm Edit certificate
   *************************************************************************/
  confirm() {
    this.certificate.contract_start_date = this.editForm.controls.contract_start_date.value;
    this.certificate.address = this.editForm.controls.address.value;
    this.certificate.contract_end_date = this.editForm.controls.contract_end_date.value;
    this.certificate.comment = this.editForm.controls.comment.value;
    this.certificate.language = this.editForm.controls.language.value;
    this.certificate.application_id = this.certificate.HRWorkCertificateKey.application_id;
    this.certificate.certification_code = this.certificate.HRWorkCertificateKey.certification_code;
    this.certificate.email_address = this.certificate.HRWorkCertificateKey.email_address;
    this.certificate.company_email = this.certificate.HRWorkCertificateKey.company_email;
    this.hrService.updateWorkCertificate(this.certificate).subscribe((data) => {
      this.utilsService.openSnackBar('updated certeficated successfully', 'save', 3000);

    }, (err) => {
      this.utilsService.openSnackBar('Something wrong', 'save', 3000);

    });
    this.router.navigate(
      ['/collaborator/work-certificates'],
      { state: {
          certificate: this.certificate
        }
      });
  }
  /**
   * @description: get ref data
   */
  async getRefData() {
    /********************************** REF DATA **********************************/
    this.refData = await this.refDataService.getRefData(
      this.utilsService.getCompanyId(
        this.companyEmail, this.localStorageService.getItem('userCredentials')['application_id']),
      this.localStorageService.getItem('userCredentials')['application_id'],
      ['PROF_TITLES'],
      false
    );
    this.utilsService
      .getNationality(this.utilsService
        .getCodeLanguage( this.localStorageService.getItem('language')['langId'])).map((nationality) => {
      this.nationalitiesList.push({ value: nationality.NATIONALITY_CODE, viewValue: nationality.NATIONALITY_DESC });
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
   * @description  Prevent Saturday and Sunday from being selected.
   *************************************************************************/
  datePickerFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };
  /**************************************************************************
   * @description Back click
   *************************************************************************/
  backClicked() {
    this.location.back();
  }
  /**************************************************************************
   * @description Get data from previous route
   *************************************************************************/
  getData() {
    this.certificate = this.router.getCurrentNavigation()?.extras?.state?.certificate;
    this.collaborator = this.router.getCurrentNavigation()?.extras.state?.collaborator;

    console.log('certificate ', this.certificate);
  }

}

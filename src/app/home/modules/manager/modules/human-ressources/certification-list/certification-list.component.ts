import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { IUserInfo } from '@shared/models/userInfo.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IWorkCertificate } from '@shared/models/workCertificate.model';
import { UserService } from '@core/services/user/user.service';
import { Router } from '@angular/router';
import { ModalService } from '@core/services/modal/modal.service';
import { HumanRessourcesService } from '@core/services/human-ressources/human-resources.service';
import { takeUntil } from 'rxjs/operators';
import { ProfileService } from '@core/services/profile/profile.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslationCustomLoaderService } from '@core/services/translation/translation-custom-loader.service';
import { RefdataService } from '@core/services/refdata/refdata.service';
@Component({
  selector: 'wid-certification-list',
  templateUrl: './certification-list.component.html',
  styleUrls: ['./certification-list.component.scss']
})
export class CertificationListComponent implements  OnInit, OnChanges, OnDestroy {

  /**************************************************************************
   * @description Input from child's Components [SUPPLIERS, CLIENTS]
   *************************************************************************/
  @Input() type: string ;
  @Input() title: string;
  @Input() email: string;
  @Input() collaboratorAction = false;
  /**************************************************************************
   * @description DATA_TABLE paginations
   *************************************************************************/
  nbtItems = new BehaviorSubject<number>(5);
  blocData = [];

  applicationId: string;
  companyId: string;
  companyEmail: string;
  emailAddress: string;
  companyName: string;
  infoUser: IUserInfo;
  redirectUrl = this.router.routerState.snapshot.url + '/addCertif';
  addButtonLabel = 'Request';
  actions = [];
  header: any;
  language = [];
  _id: any;
  translateKey: string[];
  label: any;
  languages: any;
  currentCompany: any;
  refData = { };

  /**************************************************************************
   * @description Variable used to destroy all subscriptions
   *************************************************************************/
  destroy$: Subject<boolean> = new Subject<boolean>();
  private subscriptions: Subscription[] = [];
  private subscriptionModal: Subscription;

  /**************************************************************************
   * @description UserInfo
   *************************************************************************/
  userInfo: IUserInfo;
  /**************************************************************************
   * @description UserInfo
   *************************************************************************/
  displayedColumns: string[] = [
    'full_name', 'request_status', 'status' , 'request_date' ];

  dataSource: MatTableDataSource<IWorkCertificate>;
  ELEMENT_DATA = new BehaviorSubject<any>([]);
  isLoading = new BehaviorSubject<boolean>(true);

  @ViewChild(MatPaginator, { static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true}) sort: MatSort;
  constructor(
    private hrService: HumanRessourcesService,
    private userService: UserService,
    private router: Router,
    private modalsServices: ModalService,
    private profileService: ProfileService,
    private localStorage: LocalStorageService,
    private modalService: ModalService,
    private utilsService: UtilsService,
    private translate: TranslateService,
    private translationCustomLoaderService: TranslationCustomLoaderService,
    private refDataService: RefdataService,

  ) {

  }
  /**************************************************************************
   * @description load data table certification
   *************************************************************************/
  async ngOnInit(): Promise<void> {
    this.type = 'Certification';
    this.title = 'Certificates List';
    this.translationCustomLoaderService.getAllLanguages().subscribe((res) => {
      this.languages = res;
    });
    // tslint:disable-next-line:max-line-length
    this.collaboratorAction ? this.header = { title: this.title, addActionURL: this.redirectUrl, addActionText: this.addButtonLabel} : this.header = { title: this.title} ;
    await this.getConnectedUser();
    await  this.getCertificate().then((data) => {
      this.ELEMENT_DATA.next(data);
      this.isLoading.next(false);
    });
    await this.profileService.getCompany(this.companyEmail).subscribe((company) => {
      this.currentCompany = company[0];
    });
    this.translateDocs();

  }
  /**************************************************************************
   * @description load data emitted by child components
   *************************************************************************/
  ngOnChanges(changes: { [propKey: string]: SimpleChange}) {
  }

  /**************************************************************************
   * @description Filter Date with specific value
   * @param event Value to filter with
   *************************************************************************/
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  /**************************************************************************
   * @description Get Certificate data from work certificate service
   *************************************************************************/
  async getCertificate(limit?, offset?) {
    return new Promise((resolve) => {
      // tslint:disable-next-line:max-line-length3 max-line-length
      this.hrService.getWorkCertificates(`?${ this.email ? `email_address=${this.email}&status=ACTIVE` : `company_email=${this.companyEmail}&status=ACTIVE`  }` ).subscribe( async (res) => {
        if (res['msg_code'] !== '0004') {
          await res.map((certif) => {
            this.profileService.getUser(`?email_address=${certif.HRWorkCertificateKey.email_address}`).toPromise()
              .then((profile) => {
                certif['photo'] = profile.results[0].photo;
              });
          });
          this.isLoading.next(false);
          res.map((c, index) => {
            this.language.push({
              _id: c._id,
              language: c.language
            });
          });
          this.isLoading.next(false);

          resolve(res);
        }

        this.isLoading.next(false);
        resolve([]);

      } );
    });
  }

  /**************************************************************************
   * @description: Show Work Certificate
   * @param WorkCertificate certificate Object
   * @return: WorkCertificate
   *************************************************************************/
  showCertificate(certificate: any) {
    certificate ?
      this.router.navigate([this.collaboratorAction ? this.router.routerState.snapshot.url + '/showCertif' :
          '/manager/contract-management/suppliers-contracts/showCertif'],
        {
          state: {
            certificate,
            collaborator: this.collaboratorAction
          }
        }) :
      this.utilsService.openSnackBar('you must select one certification', 'close');

  }

  /**************************************************************************
   * @description: Show Work Certificate
   * @param WorkCertificate certificate Object
   * @return: WorkCertificate
   *************************************************************************/
  updateCertificate(certificate: any) {
    if ((this.collaboratorAction ) || !this.collaboratorAction) {
      this.router.navigate([this.collaboratorAction ? this.router.routerState.snapshot.url + '/editCertif' :
          '/manager/contract-management/suppliers-contracts/editCertif'],
        {
          state: {
            certificate,
            collaborator: this.collaboratorAction

          }
        });
    } else {
      this.utilsService.openSnackBar('you must select one certification', 'close');

    }

  }
  activateCertification(certificate: any ) {
    if (certificate.status === 'ACTIVE') {
      this.utilsService.openSnackBar('certification already activate', 'close');

    } else {
      this.hrService.enableWorkCertificate(certificate._id)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(
          (res1) => {
            this.getCertificate(this.nbtItems.getValue(), 0);
            this.utilsService.openSnackBar('certification activate Successfully', 'close');
          },
          (err) => {
            this.utilsService.openSnackBar('something wrong', 'close');
            console.log(err);

          }
        );
    }

  }

  /**************************************************************************
   * @description: Function to call  Dialog
   * @return: Updated Work Certificate Status
   *************************************************************************/
  onStatusChange(certificate: any) {
    this._id = certificate._id;
    const element = this.blocData.filter(x => x._id === this._id)[0];
    const index = this.ELEMENT_DATA.value.indexOf(element);

    const confirmation = {
      code: 'delete',
      title: 'delete Info',
      description: `Are you sure you want to delete ?`,
    };

    this.subscriptionModal = this.modalsServices.displayConfirmationModal(confirmation, '560px', '300px')
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (res) => {
          if ( index !== -1 && res === true ) {
            this.blocData.splice(index, 1);
            this.ELEMENT_DATA.next(this.blocData.slice());
            this.hrService.disableWorkCertificate(this._id)
              .pipe(
                takeUntil(this.destroy$)
              )
              .subscribe(
                (res1) => {
                  this.getCertificate(this.nbtItems.getValue(), 0);
                  this.utilsService.openSnackBar('Deleted Successfully', 'close');

                },
                (err) => {
                  this.utilsService.openSnackBar('something wrong', 'close');
                  console.log(err);

                }
              );
          }

        } );

  }

  /**
   * @description: get connected user
   */
  async  getConnectedUser(): Promise<void> {
    const cred = this.localStorage.getItem('userCredentials');
    this.applicationId = cred['application_id'];
    this.emailAddress = cred['email_address'];
    this.userService.connectedUser$.subscribe(async (data) => {
      if (!!data) {
        this.infoUser = data;
        this.companyName = data['company'][0]['company_name'];
        this.companyId = data['company'][0]['_id'];
        this.companyEmail = data['company'][0]['companyKey']['email_address'];
        await this.getRefData(this.companyEmail);
      }
    });
  }

  /**************************************************************************
   * @description get selected Action From Dynamic DataTABLE
   * @param rowAction Object { data, rowAction }
   * data _id
   * rowAction [show, update, delete, download , activate]
   *************************************************************************/
  switchAction(rowAction: any) {
    switch (rowAction.actionType) {
      case ('show'):  this.showCertificate(rowAction.data[0]);
        break;
      case ('update'): rowAction.data['request_status'] === 'Confirmed' ? this.pdf(rowAction.data) :  this.showCertificate(rowAction.data);
        break;
      case('delete'):  this.onStatusChange(rowAction.data[0]);
        break;
      case('download'):  this.pdf(rowAction.data[0]);
        break;
      case('activate'): this.activateCertification(rowAction.data[0]);
        break;
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
    this.subscriptions.forEach((subscription => subscription.unsubscribe()));
  }
  /**************************************************************************
   * @description get translate keys for certification
   *************************************************************************/
  translateDocs() {
    this.translateKey = ['rh_text_certif', 'rh_text_text_certif', 'rh_m_certif'
      , 'rh_mr_certif', 'rh_domicilied_certif', 'rh_since_certif', 'rh_personnel_certif'
      , 'rh_atteste_certif', 'rh_society_certif', 'rh_title_certif', 'rh_capital_certif', 'rh_undersigned_certif', 'rh_object_certif',
      'rh_cdi_certif', 'rh_sivp_certif', 'rh_and_certif', 'rh_contract_certif', 'rh_under_certif', 'rh_email_certif', 'rh_activation_certif',
      'rh_website_certif', 'rh_cdd_certif' , 'rh_f_certif', 'rh_article3_certif', 'rh_article2_certif'
      , 'rh_article1_certif' , 'rh_fonctions_certif', 'rh_renumeration_certif', 'rh_salary_certif',
      'rh_employed_certif', 'rh_presente_certif', 'rh_number_certif', 'rh_commerce_certif', 'rh_exp_certif',
      'rh_cdi', 'rh_cdd' , 'rh_travail' , 'rh_recrute'
    ];

    this.translate.get(this.translateKey).subscribe(res => {
      this.label = {
        rhTextCertif: res['rh_text_certif'],
        rhTextTextCertif: res['rh_text_text_certif'],
        rhMCertif: res['rh_m_certif'],
        rhDomiciliedCertif: res['rh_domicilied_certif'],
        rhMrCertif: res['rh_mr_certif'],
        rhSinceCertif: res['rh_since_certif'],
        rhPersonnelCertif: res['rh_personnel_certif'],
        rhAttesteCertif: res['rh_atteste_certif'],
        rhSocietyCertif: res['rh_society_certif'],
        rhTitleCertif: res['rh_title_certif'],
        rhCapitalCertif: res['rh_capital_certif'],
        rhUndersignedCertif: res['rh_undersigned_certif'],
        rhObjectCertif: res['rh_object_certif'],
        rhCdiCertif: res['rh_cdi_certif'],
        rhSivpCertif: res['rh_sivp_certif'],
        rhAndCertif: res['rh_and_certif'],
        rhContractCertif: res['rh_contract_certif'],
        rhUnderCertif: res['rh_under_certif'],
        rhEmailCertif: res['rh_email_certif'],
        rhWebsiteCertif: res['rh_website_certif'],
        rhActivationCertif: res['rh_activation_certif'],
        rhCddCertif: res['rh_cdd_certif'],
        rhFCertif: res['rh_f_certif'],
        rhArticle1Certif: res['rh_article1_certif'],
        rhArticle2Certif: res['rh_article2_certif'],
        rhArticle3Certif: res['rh_article3_certif'],
        rhFonctionsCertif: res['rh_fonctions_certif'],
        rhRenumerationCertif: res['rh_renumeration_certif'],
        rhSalaryCertif: res['rh_salary_certif'],
        rhEmployedCertif: res['rh_employed_certif'],
        rhPresenteCertif: res['rh_presente_certif'],
        rhNumberCertif: res['rh_number_certif'],
        rhCommerceCertif: res['rh_commerce_certif'],
        rhExpCertif: res['rh_exp_certif'],
        rhCDI: res['rh_cdi'],
        rhCDD: res['rh_cdd'],
        rhRecrute: res['rh_recrute'],
        rhTravail: res['rh_travail']
      };
    });
  }

  async getRefData(companyEmail: string) {

    /********************************** REF DATA **********************************/
    this.refData = await this.refDataService.getRefData(
      this.utilsService.getCompanyId(
        // tslint:disable-next-line:max-line-length
        companyEmail, this.localStorage.getItem('userCredentials')['application_id']),
      this.localStorage.getItem('userCredentials')['application_id'],
      ['PROF_TITLES'],
      false
    );
  }

  /**************************************************************************
   * @description export pdf contains the certification of the collaborator
   * data: contains the data of certification
   *************************************************************************/

  async pdf(certificate: any) {
    const lang = this.language.filter(x => x._id === certificate._id)[0];
    certificate['data'] = this.currentCompany;
    certificate['label'] = this.label;

    if (certificate && certificate.request_status === 'Confirmed' && certificate.signature ) {
      if (certificate['data'].stamp) {
        await  this.profileService.getAllUser(this.companyEmail, 'COMPANY').subscribe(async res => {
            certificate['company'] = res['results'][0];
            const postionManager =   await this.refData['PROF_TITLES'].find(
              (item) =>  item.value === res['results'][0].title_id
            ).viewValue;
            const position = await this.refData['PROF_TITLES'].find(
              (item) =>  item.value === certificate.title_id
            ).viewValue;
            certificate['companyName'] = this.companyName;
            certificate['lang'] = lang;
            certificate['positionManager'] = postionManager;
            certificate['position'] = position;
            await this.hrService.generateCertif(certificate).subscribe(async (data) => {
              const iframe = '<iframe width=\'100%\' height=\'100%\' src=\'' + data.result + '\'></iframe>';
              // tslint:disable-next-line:prefer-const
              const x = window.open();
              x.document.open();
              x.document.write(iframe);
              x.document.close();

              // tslint:disable-next-line:prefer-const

            }, (err) => {
              this.utilsService.openSnackBar('Something wrong', 'close');
              console.log('error ', err);
            });
          }
        );

      } else {
        this.utilsService.openSnackBar('stamp required', 'close');

      }

    } else {
      this.utilsService.openSnackBar('certification not confirmed yet', 'close');

    }

  }
  /**************************************************************************
   * @description colors for request status
   *************************************************************************/
  colorCheck() {
    return  [{
      columnCode: 'request_status',
      condValue: [
        'Pending',
        'Confirmed',
        'Rejected'
      ],
      color: [
        'golden-yellow',
        'topaz',
        'red',
      ],
    }];
  }

}
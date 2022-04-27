import { Component, Input, OnInit } from '@angular/core';
import { TrainingService } from '@core/services/training/training.service';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { ITraining } from '@shared/models/training.model';
import { Router } from '@angular/router';
import { UserService } from '@core/services/user/user.service';
import { ITrainingRequest } from '@shared/models/trainingRequest.model';
import { ProfileService } from '@core/services/profile/profile.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { ModalService } from '@core/services/modal/modal.service';
import { takeUntil } from 'rxjs/operators';
import { HumanRessourcesService } from '@core/services/human-ressources/human-resources.service';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { ICollaborator } from '@shared/models/collaborator.model';
import { IHrContract } from '@shared/models/hrContract.model';
import { IUserInfo } from '@shared/models/userInfo.model';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { IViewParam } from '@shared/models/view.model';

import { ShowTrainingRequestComponent } from '../show-training-request/show-training-request.component';

@Component({
  selector: 'wid-list-request-training',
  templateUrl: './list-request-training.component.html',
  styleUrls: ['./list-request-training.component.scss']
})
export class ListRequestTrainingComponent implements OnInit {

  @Input() email: string;
  @Input() collaborator: boolean;
  @Input() title: string;
  ELEMENT_DATA = new BehaviorSubject<ITraining[]>([]);
  collaboratorInfo: ICollaborator;
  contractInfo: IHrContract;
  userInfo: any;
  isLoading = new BehaviorSubject<boolean>(true);
  listRequest: ITraining[];
  nbtItems = new BehaviorSubject<number>(5);
  featureAdd = 'SOURCING_CAND_FILE_ACCESS';
  applicationId: string;
  companyId: string;
  companyEmail: string;
  emailAddress: string;
  companyName: string;
  title_cd: string;
  connectedUser: IUserInfo;
  refData = { };
  position = '';
  domainList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  titlesList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  tabFeatureAccess = [
    { name: 'Update', feature: 'SOURCING_CAND_FILE_ACCESS'},
    { name: 'Show', feature: 'SOURCING_CAND_FILE_ACCESS'},
    { name: 'Delete', feature: 'SOURCING_CAND_FILE_ACCESS'}];

  constructor(
      private userService: UserService,
      private trainingService: TrainingService,
      private profileService: ProfileService,
      private router: Router,
      private utilsService: UtilsService,
      private modalService: ModalService,
      private hrService: HumanRessourcesService,
      private appInitializerService: AppInitializerService,
      private localStorageService: LocalStorageService,
      private refDataService: RefdataService,

  ) { }

  async ngOnInit(): Promise<void> {
   await this.getConnectedUser();
    this.modalService.registerModals(
        { modalName: 'showTrainingRequest', modalComponent: ShowTrainingRequestComponent});
    this.getTrainingsRequest(this.nbtItems.getValue(), 0);
    await this.getData();
  }

  /**
   * @description Request List Training
   */
  getTrainingsRequest(limit?, offset?): Promise<ITrainingRequest[]> {
    let url = '';
    this.collaborator ?
        url = `?beginning=${offset}&number=${limit}&collaborator_email=${this.email}&status=ACTIVE` :
        url = `?beginning=${offset}&number=${limit}&email_address=${this.email}&status=ACTIVE`;
  return new Promise((resolve) => {
    this.trainingService
        .getTrainingRequest(url)
        .subscribe((request) => {

          request['results'].map(async (u) => {
            await this.profileService.getUser(`?email_address=${this.email}`).subscribe((user) => {
              u['photo'] = user['results'][0]['photo'];
              u['full_name'] = user['results'][0]['first_name'] + ' ' + user['results'][0]['last_name'];
              u['first_name'] = user['results'][0]['first_name'];
              u['last_name'] = user['results'][0]['last_name'];

            });
          });
            this.listRequest = request['results'];
            this.ELEMENT_DATA.next(request);
            this.isLoading.next(false);
            resolve(this.listRequest);
        });
  });
  }
  /**************************************************************************
   * @description get selected Action From Dynamic DataTABLE
   * @param rowAction Object { data, rowAction }
   * data _id
   * rowAction [show, update, delete]
   *************************************************************************/
  async switchAction(rowAction: any) {
    switch (rowAction.actionType.name) {
      case('Show') :
        await this.show(rowAction.data[0]);
        break;
      case ('Delete') :
        this.archiver(rowAction.data[0]);
        break;
      case ('Update') :
        this.update(rowAction.data[0]);
        break;
      case ('update'):
        this.collaborator && rowAction.data.status_request === 'PENDING' ?
            this.update(rowAction.data) : await this.show(rowAction.data);
        break;
    }
  }
  /**************************************************************************
   * @description get Date with nbrItems as limit
   * @param params object
   *************************************************************************/
  async loadMoreItems(params) {
    this.nbtItems.next(params.limit);
    await this.getTrainingsRequest(params.limit, params.offset);
  }
  /**************************************************************************
   * @description colors for request status
   *************************************************************************/
  colorCheck() {
    return  [{
      columnCode: 'status_request',
      condValue: [
        'PENDING',
        'ACCEPT',
        'REJECT'
      ],
      color: [
        'golden-yellow',
        'topaz',
        'red',
      ],
    }];
  }

  /**
   * @description update request
   */
  update(request: ITrainingRequest) {
    this.router.navigate(['/collaborator/training/update-request'], {
      queryParams: {
        id: btoa(request._id),
        rc: btoa(request.TrainingRequestKey.request_code)
      }
    });
  }

  /**
   * @description show request
   */
  async show(request: ITrainingRequest) {
    const promises = await Promise.all([this.getContractCollaborator(request.TrainingRequestKey.collaborator_email),
      this.getCollaboratorInfo(request.TrainingRequestKey.collaborator_email),
      this.getUserInfo(request.TrainingRequestKey.collaborator_email)
    ]);
    const arr = [];
    const domain = this.domainList.getValue().filter(x => x.value === request.domain)[0].viewValue;
    const title = this.titlesList.getValue().filter(x => x.value === this.userInfo.title_id)[0].viewValue;
    promises.forEach((r) => { arr.push(r); });
    this.modalService.displayModal('showTrainingRequest', {
         data: arr,
         training: request,
         title,
         domain
        },
        '520px', '520px')
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
   * @description get collaborator data
   */
  getCollaboratorInfo(email: string): Promise<ICollaborator> {
    return new Promise<ICollaborator>((resolve) => {
      this.hrService.getCollaborators(`?email_address=${email}`).subscribe((collaborators) => {
          this.collaboratorInfo = collaborators[0];
          resolve(this.collaboratorInfo);
      });
    });
  }
  /**
   * @description get connected user
   */
  async  getConnectedUser(): Promise<void> {
    const cred = this.localStorageService.getItem('userCredentials');
    this.applicationId = cred['application_id'];
    this.emailAddress = cred['email_address'];
    this.userService.connectedUser$.subscribe(async (data) => {
      if (!!data) {
        this.connectedUser = data;
        this.companyName = data['company'][0]['company_name'];
        this.companyId = data['company'][0]['_id'];
        this.companyEmail = data['company'][0]['companyKey']['email_address'];
      }
    });
  }
  /**
   * @description get all refdata
   */
  async getData() {
    this.refData = await this.refDataService.getRefData(
        this.utilsService.getCompanyId(
            this.companyEmail, this.localStorageService.getItem('userCredentials')['application_id']),
        this.localStorageService.getItem('userCredentials')['application_id'],
        ['DOMAIN', 'PROF_TITLES'],
        false
    );
    this.domainList.next(this.refData['DOMAIN']);
    this.titlesList.next(this.refData['PROF_TITLES']);
  }

  /**
   * @description get user info
   */
  getUserInfo(email: string): Promise<IUserInfo> {
      return new Promise<IUserInfo>((resolve) => {
        this.profileService.getUserByEmail(email).subscribe((user) => {
          this.userInfo = user['results'][0];
          resolve(this.userInfo);
        });
      });
  }

  /**
   * @description get contract collaborator
   */
  getContractCollaborator(email: string): Promise<IHrContract> {
    return new Promise<IHrContract>((resolve) => {
      this.hrService.getContract(`?collaborator_email=${email}`).subscribe((contract) => {
        this.contractInfo = contract[0];
        resolve(this.contractInfo);
      });
    });
  }

  /**
   * @description archiver request
   */
  archiver(request: ITrainingRequest) {
    if (this.collaborator) {
      if (request.status_request === 'PENDING') {
        this.trainingService.disableTrainingRequest(`?_id=${request._id}`).subscribe(async (data) => {
          await this.getTrainingsRequest(this.nbtItems.getValue(), 0);
          this.utilsService.openSnackBar('Training Request archivate');

        });
      }
    } else {
      this.trainingService.disableTrainingRequest(`?_id=${request._id}`).subscribe(async (data) => {
        await this.getTrainingsRequest(this.nbtItems.getValue(), 0);
        this.utilsService.openSnackBar('Training Request archivate');

      });
    }

  }

}

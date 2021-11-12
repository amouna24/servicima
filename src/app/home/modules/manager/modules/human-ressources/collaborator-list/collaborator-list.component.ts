import { Location } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { HumanRessourcesService } from '@core/services/human-ressources/human-resources.service';
import { ProfileService } from '@core/services/profile/profile.service';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UserService } from '@core/services/user/user.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatSelectChange } from '@angular/material/select';
import { IHrContract } from '@shared/models/hrContract.model';
import { IBanking } from '@shared/models/banking.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ICollaborator } from '@shared/models/collaborator.model';
import { IUserModel } from '@shared/models/user.model';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
@Component({
  selector: 'wid-collaborator-list',
  templateUrl: './collaborator-list.component.html',
  styleUrls: ['./collaborator-list.component.scss']
})
export class CollaboratorListComponent implements OnInit, OnDestroy {
  usersInfo = [];
  userList: BehaviorSubject<any> = new BehaviorSubject<any>(this.usersInfo);
  companyEmail: string;
  applicationId: string;
  avatar: any;
  filterArray = [];
  uploadURL = environment.uploadFileApiUrl + '/image/';
  nbtItems = new BehaviorSubject<number>(8);
  collaborator: ICollaborator;
  userInfo: IUserModel = null;
  contract: IHrContract;
  banking: IBanking;
  sortedby = new FormControl('', Validators.required);
  isLoading = new BehaviorSubject<boolean>(false);
  length = 0;
  lengthPage = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  mediaSub: Subscription;
  device: string;
  constructor( private hrService: HumanRessourcesService,
               private localStorageService: LocalStorageService,
               private userService: UserService,
               private profileService: ProfileService,
               private router: Router,
               private location: Location,
               private appInitializerService: AppInitializerService,
               private utilsService: UtilsService,
               private refDataService: RefdataService,
               public  mediaObserver: MediaObserver
  ) {
  }
  async ngOnInit(): Promise<void> {
    this.mediaSub = this.mediaObserver.media$.subscribe((result: MediaChange) => {
      this.device = result.mqAlias;
    });
    await this.getCollaboratorList();
  }
  /**************************************************************************
   * @description: Function getList of collaborator
   * @return: Updated filterArray
   *************************************************************************/
  async getCollaboratorList(offset? , limit ?) {
    const cred = this.localStorageService.getItem('userCredentials');
    this.applicationId = cred['application_id'];
    this.companyEmail = cred['email_address'];
    await this.refDataService.getRefData(
      this.utilsService.getCompanyId(this.companyEmail, this.applicationId),
      this.applicationId,
      ['PROF_TITLES']
    );
    this.profileService.getAllUser(this.companyEmail, 'COLLABORATOR', limit ? limit : 8, offset ? offset : 0)
      .subscribe(async data => {
        this.length = await this.profileService.countCollaborator(this.companyEmail);
        this.lengthPage = Math.round(this.length / this.nbtItems.getValue());
        this.usersInfo = data['results'].map(
          (obj) => {
            return {
              _id: obj._id,
              userKey: obj.userKey,
              full_name: obj.first_name + ' ' + obj.last_name,
              email_address: obj.userKey.email_address,
              photo: obj.photo,
              job_title: this.utilsService.getViewValue(obj.title_id, this.refDataService.refData['PROF_TITLES'])
            };
          });
        this.filterArray = this.usersInfo;
        this.userList.next(this.usersInfo.slice());
        this.isLoading.next(true);
      });
    this.userService.avatar$.subscribe(
      avatar => {
        this.avatar = avatar;
      }
    );
  }
  /**************************************************************************
   * @description: Function to call collaborator-hr-records with current data
   * @param User collaborator Object
   * @return: Updated userInfo
   *************************************************************************/
  collaboratorDetails(id: string, email: string) {
    this.hrService.getContract(`?collaborator_email=${email}`).subscribe(async ( contract) => {
      this.contract = contract[0];
      this.hrService.getBanking(`?email_address=${email}`).subscribe(async (banking) => {
        this.banking = banking[0];
        this.profileService.getUserById(id).subscribe(async ( user) => {
          this.userInfo = user['results'][0];
          this.hrService.getCollaborators(`?email_address=${email}`)
            .subscribe(async collaborator => {
              this.collaborator = collaborator[0];
              await  this.router.navigate(
                ['/manager/contract-management/suppliers-contracts/collaborators'],
                { state: {
                    _id: id,
                    contract: this.contract,
                    banking: this.banking,
                    userInfo: this.userInfo,
                    collaborator: this.collaborator
                  }
                });
            });

        });

      });
    });

  }
  /**************************************************************************
   * @description back click
   *************************************************************************/
  backClicked() {
    this.location.back();
  }
  ngOnDestroy() {
    this.mediaSub.unsubscribe();
  }

  /**
   * @params filterValue
   * @description table filter
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterArray = [];
    this.usersInfo.filter(
      (res) => {
        if (
          res.full_name.toLowerCase().includes(filterValue.trim().toLowerCase())
        ) {
          this.filterArray.push(res);
        }
      },
    );
  }
  /**
   * @params event
   * @description table sorted by field
   */
  sortedBy(event: MatSelectChange) {
    this.filterArray = [];
    this.usersInfo.sort((a, b) => a[this.sortedby.value].localeCompare(b[this.sortedby.value]));
    this.filterArray = this.usersInfo;
  }
  /**
   * @params event: PageEvent
   * @description page change when link clicked
   */
  async onPaginateChange(event: PageEvent) {
    await this.getCollaboratorList(event.pageIndex * this.nbtItems.getValue(), this.nbtItems.getValue());
  }
  /**
   * @params value: number
   * @description number of paggination clicked
   */
  async loadData(value: number) {
    await  this.getCollaboratorList(value * this.nbtItems.getValue(), this.nbtItems.getValue());
  }

}

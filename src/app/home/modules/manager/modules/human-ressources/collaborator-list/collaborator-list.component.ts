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
import { MatPaginator } from '@angular/material/paginator';
import { ICollaborator } from '@shared/models/collaborator.model';
import { IUserModel } from '@shared/models/user.model';
import { dataAppearance } from '@shared/animations/animations';

@Component({
  selector: 'wid-collaborator-list',
  templateUrl: './collaborator-list.component.html',
  styleUrls: ['./collaborator-list.component.scss'],
  animations: [
    dataAppearance
  ]
})
export class CollaboratorListComponent implements OnInit, OnDestroy {
  usersInfo = [];
  userList: BehaviorSubject<any> = new BehaviorSubject<any>(this.usersInfo);
  companyEmail: string;
  applicationId: string;
  avatar: any;
  filterArray = [];
  uploadURL = environment.uploadFileApiUrl + '/image/';
  nbtItems = new BehaviorSubject<number>(10);
  itemsPerPage = [5, 10, 25, 100];
  currentPage = 1;
  itemsPerPageControl = new FormControl(5);
  totalItems: number;
  countedItems = 0;
  totalCountedItems = null;
  offset: number;
  limit: number;
  nbrPages: number[];
  collaborator: ICollaborator;
  userInfo: IUserModel = null;
  contract: IHrContract;
  banking: IBanking;
  sortedby = new FormControl('', Validators.required);
  isLoading = new BehaviorSubject<boolean>(false);
  @ViewChild(MatPaginator) paginator: MatPaginator;
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
  ) {
  }
  async ngOnInit(): Promise<void> {
    await this.getCollaboratorList(this.nbtItems.getValue(), 0);
  }
  /**************************************************************************
   * @description: Function getList of collaborator
   * @return: Updated filterArray
   *************************************************************************/
  async getCollaboratorList(limit?, offset?) {
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
        this.totalItems = data['total'] ? data['total'] : null;
        this.countedItems = data['count'] ? data['total'] : null;
        console.log('data ', data);
        this.offset = data['offset'];
        this.currentPage = this.offset === 1 ? 1 : this.currentPage;
        console.log('my offset ', this.offset);
        this.currentPage = this.offset === 1 ? 1 : this.currentPage;
        this.limit = data['limit'] ? Number(data['limit']) : null;
        this.nbrPages = data['total'] ? Array(Math.ceil(Number(data['total']) / this.nbtItems.getValue()))  .fill(null)
            .map((x, i) => i + 1) : null;

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
      console.log('my contract Collaborator details ', this.contract);
        this.profileService.getUserById(id).subscribe(async ( user) => {
          this.userInfo = user['results'][0];
          this.hrService.getCollaborators(`?email_address=${email}`)
            .subscribe(async collaborator => {
              this.collaborator = collaborator[0];
              const queryObject = {
                _id: id,
                idContract: this.contract._id,
              };
              this.utilsService.navigateWithQueryParam('/manager/human-ressources/collaborator', queryObject);
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
   * @params value: number
   * @description number of paggination clicked
   */
  async loadData(value: number) {
    await  this.getCollaboratorList(this.nbtItems.getValue(), (value - 1) * this.nbtItems.getValue());
  }

  /**************************************************************************
   * @description Get next, previous or specific page
   * @params type : next / previous / specific
   * @params pageNumber : number of specific page
   *************************************************************************/
  async getItemsPerPage(type: string, pageNumber?: number) {
    switch (type) {
      case 'first-page' : {
        this.currentPage = this.nbrPages ? this.nbrPages[0] : 1;
        await this.loadData(this.currentPage);

      }
        break;
      case 'previous-page' : {

        this.currentPage -= 1;
        await this.loadData(this.currentPage);

      }
        break;
      case 'specific-page' : {
        this.currentPage = pageNumber;
        console.log('current page', this.currentPage);
        await this.loadData(this.currentPage);

      }
        break;
      case 'next-page' : {

        this.currentPage += 1;
        await this.loadData(this.currentPage);

      }
        break;
      case 'last-page' : {

        this.currentPage = this.nbrPages[this.nbrPages.length - 1];
        await this.loadData(this.currentPage);

      }
        break;
    }
  }

}

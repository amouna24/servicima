import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from '@core/services/user/user.service';
import { CandidateService } from '@core/services/candidate/candidate.service';
import { ProfileService } from '@core/services/profile/profile.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { Router } from '@angular/router';
import { environment } from '@environment/environment';
import { dataAppearance } from '@shared/animations/animations';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'wid-candidates-list',
  templateUrl: './candidates-list.component.html',
  styleUrls: ['./candidates-list.component.scss'],
  animations: [
    dataAppearance
  ]
})
export class CandidatesListComponent implements OnInit {
  @Input() title = 'Candidates List';
  emailAddress: string;
  applicationId: string;
  nbtItems = new BehaviorSubject<number>(10);
  itemsPerPage = [5, 10, 25, 100];
  currentPage = 1;
  itemsPerPageControl = new FormControl(5);
  totalItems: number;
  countedItems = 0;
  nbrPages: number[];
  totalCountedItems = null;
  offset: number;
  limit: number;
  ELEMENT_DATA = new BehaviorSubject<any[]>([]);
  isLoading = new BehaviorSubject<boolean>(false);
  listCandidates: any[] = [];
  uploadURL = environment.uploadFileApiUrl + '/image/';
  sortedby: string;
  avatar: any;
  column: string;

    constructor(
      private location: Location,
      private userService: UserService,
      private candidateService: CandidateService,
      private router: Router,
      private profileService: ProfileService,
      private localStorageService: LocalStorageService,
      private utilsService: UtilsService,
      private refDataService: RefdataService,

  ) { }
  /**************************************************************************
   * @description back click
   *************************************************************************/
  backClicked() {
    this.location.back();
  }

  /**
   * @description get ref data
   */
 async getRefdata() {
    await this.refDataService.getRefData(
        this.utilsService.getCompanyId(this.emailAddress, this.applicationId),
        this.applicationId,
        ['PROF_TITLES']
    );
  }

  async ngOnInit(): Promise<void> {
      this.getDataFromLocalStorage();
      await this.getRefdata();
      await this.getCandidates(this.nbtItems.getValue(), 0);
  }
  /**
   * @description get connected user from local storage
   */
  getDataFromLocalStorage() {
    const cred = this.localStorageService.getItem('userCredentials');
    this.emailAddress = cred['email_address'];
    this.applicationId = cred['application_id'];
  }
  /**
   * @description get List candidates
   */
 async getCandidates(limit?, offset?) {
     this.isLoading.next(true);
     this.profileService.getAllUser(this.emailAddress, 'CANDIDATE', limit, offset).subscribe((data) => {
         this.totalItems = data['total'] ? data['total'] : null;
         this.countedItems = data['count'] ? data['total'] : null;
         this.currentPage = this.offset === 1 ? 1 : this.currentPage;
         console.log('my offset ', this.offset);
         this.currentPage = this.offset === 1 ? 1 : this.currentPage;
         this.limit = data['limit'] ? Number(data['limit']) : null;
         this.nbrPages = data['total'] ? Array(Math.ceil(Number(data['total']) / this.nbtItems.getValue()))  .fill(null)
             .map((x, i) => i + 1) : null;
         this.listCandidates = data['results'].map((candidate) => {
             return {
                 _id: candidate._id,
                 full_name: candidate.first_name + ' ' + candidate.last_name,
                 photo: candidate.photo,
                 email_address: candidate.userKey.email_address,
                 job_title: this.utilsService.getViewValue(candidate.title_id, this.refDataService.refData['PROF_TITLES'])
             };
         });
         console.log('my list candidates ', this.listCandidates);
         this.ELEMENT_DATA.next(this.listCandidates);
         this.isLoading.next(true);
     });
      this.userService.avatar$.subscribe(
          avatar => {
              this.avatar = avatar;
          }
      );
  }

  /**
   * @description load more data
   */
  async loadData(value: number) {
    await this.getCandidates(this.nbtItems.getValue(), (value - 1) * this.nbtItems.getValue());
  }

    /**
     * @description get details file
     */
    details(candidate: any) {
        this.router.navigate(
            ['/manager/human-ressources/candidate-file'],
            { queryParams: {
                    id: btoa(candidate._id),
                    ec: btoa(candidate.email_address)
                }
            });
    }
  /**
   * @params event
   * @description table sorted by field
   */
  sortedBy(event: MatSelectChange) {

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

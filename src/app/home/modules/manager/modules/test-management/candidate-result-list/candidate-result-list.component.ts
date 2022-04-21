import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TestService } from '@core/services/test/test.service';
import { UserService } from '@core/services/user/user.service';
import { UtilsService } from '@core/services/utils/utils.service';

@Component({
  selector: 'wid-candidate-result-list',
  templateUrl: './candidate-result-list.component.html',
  styleUrls: ['./candidate-result-list.component.scss']
})
export class CandidateResultListComponent implements OnInit {
  nbtItems = new BehaviorSubject<number>(5);
  @Input() isLoading = new BehaviorSubject<boolean>(false);
  @Input() tableData = new BehaviorSubject<any>([]);
  companyEmailAddress: string;
  constructor(
    private testService: TestService,
    private userService: UserService,
    private utilsService: UtilsService
  ) { }

  ngOnInit(): void {
    this.getConnectedUser();
    this.getData(0, this.nbtItems.getValue());
  }
  switchAction(event: any) {
    switch (event.actionType.name) {
      case ('update'):
        break;
    }
  }
  loadMoreItems(event: any) {
    this.nbtItems.next(event.limit);
    this.getData(event.offset, event.limit);
  }

  getData(offset, limit) {
    const dataList = [];
    this.isLoading.next(true);
    this.testService.getTestCandidateResultDataTable(`?company_email=${
      this.companyEmailAddress}&application_id=${
      this.utilsService.getApplicationID('SERVICIMA')}&beginning=${
      offset}&number=${limit}`).subscribe((candidatesResults) => {
        if (candidatesResults['results'].length !== 0) {
          candidatesResults['results'].map( (oneCandidateResult) => {
            dataList.push({
              session: oneCandidateResult.TestCandidateResultKey.session_name,
              duration: oneCandidateResult.time,
              result: oneCandidateResult.final_result,
              candidate_name: oneCandidateResult.full_name,
              date: new Date( parseInt( oneCandidateResult._id.toString().substring(0, 8), 16 ) * 1000 )
            });
          });
          candidatesResults['results'] = dataList;
          this.tableData.next(candidatesResults);
          this.isLoading.next(false);

        } else {
          this.tableData.next([]);
          this.isLoading.next(false);
        }
    });
  }
  getConnectedUser() {
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.companyEmailAddress = userInfo['company'][0]['companyKey']['email_address'];          }
        });
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TestService } from '@core/services/test/test.service';
import { UserService } from '@core/services/user/user.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { ITestSessionQuestionModel } from '@shared/models/testSessionQuestion.model';

@Component({
  selector: 'wid-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.scss']
})
export class SessionListComponent implements OnInit {
  @Input() tableData = new BehaviorSubject<any>([]);
  @Input() isLoading = new BehaviorSubject<boolean>(false);
  nbtItems = new BehaviorSubject<number>(5);
  companyEmailAddress: string;
  applicationId: string;

  constructor(
    private testService: TestService,
    private userService: UserService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.getConnectedUser();
    this.getDataFromLocalStorage();
    this.getData(0, this.nbtItems.getValue());
  }
  /**
   * @description Get connected user
   */
  getConnectedUser() {
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.companyEmailAddress = userInfo['company'][0]['companyKey']['email_address'];          }
        });
  }
  getDataFromLocalStorage(): void {
    const userCredentials = this.localStorageService.getItem('userCredentials');
    this.applicationId = userCredentials?.application_id;
  }
  getData(offset: number, limit: number) {
    this.isLoading.next(true);
    const blocData = [];
    let index = 1;
    this.testService
      .getSessionDataTable(`?company_email=${this.companyEmailAddress}&application_id=${this.applicationId}&beginning=${offset}&number=${limit}`)
      .subscribe( (listSessions) => {
        if (listSessions['results'].length !== 0) {
          listSessions['results'].forEach((oneSession) => {
            this.testService.getSessionQuestion(`?session_code=${
              oneSession.TestSessionKey.session_code}&company_email=${
              this.companyEmailAddress}&application_id=${
              this.applicationId}`).subscribe((questionsList) => {
              this.testService
                .getSessionInfo(`?company_email=${
                  this.companyEmailAddress}&application_id=${
                  this.applicationId}&session_code=${
                  oneSession.TestSessionKey.session_code}`).subscribe(async (oneSessionInfo) => {
                return new Promise(async (resolve) => {
                  blocData.push({
                    session_code: oneSession.TestSessionKey.session_code,
                    session_technologies: await this.getTechnologies(oneSession.TestSessionKey.block_questions_code),
                    session_points: await this.getSessionPoints(questionsList),
                    session_questions: questionsList.length,
                    session_time: this.convertSessionTime(oneSessionInfo[0].test_session_time),
                    level: await this.getLevel(oneSessionInfo[0].level_code),
                    session_name: oneSessionInfo[0].session_name,
                  });
                  index++;
                  if (index > listSessions['results'].length) {
                    listSessions['results'] = blocData;
                    resolve(listSessions);
                  }
                }).then((result) => {
                  this.isLoading.next(false);
                  this.tableData.next(result);
                });

              });
            });
          });
        } else {
          this.isLoading.next(false);
          this.tableData.next([]);
        }
          });
  }

  switchAction(event: any) {
  }
  getTechnologies(sessionBlocCodes) {
    const technologiesArray = [];
    let  index = 1;
    return new Promise( (resolve) => {
      const blocCodeArray = sessionBlocCodes.split(',');
      blocCodeArray.map( (blocCode) => {
        this.testService.getQuestionBloc(`?test_question_bloc_code=${blocCode}`).subscribe( (oneBloc) => {
          this.testService.getTechnologies(`?test_technology_code=${oneBloc['results'][0].TestQuestionBlocKey.test_technology_code}`)
            .subscribe( (oneTechnology) => {
              technologiesArray.push(oneTechnology[0].technology_title);
              index === blocCodeArray.length ? resolve(technologiesArray) : ++index;
            });
        });
      });
    }).then( (result) => {
      return result;
    });
      }
  loadMoreItems(event: any) {
      this.nbtItems.next(event.limit);
      this.getData(event.offset, event.limit);
  }
   getSessionPoints(questionsList: ITestSessionQuestionModel[]) {
     let totalPoint = 0;
     let index = 1;
     return new Promise( (resolve) => {
       if (questionsList['msg_code'] !== '0004') {
         questionsList.forEach( (oneQuestion) => {
           this.testService
             .getQuestion(`?test_question_code=${oneQuestion.TestSessionQuestionsKey.test_question_code}`)
             .subscribe( (question) => {
               totalPoint += Number(question[0].mark);
               index >= questionsList.length ? resolve(totalPoint) : index++;
             });
         });
       } else {
         resolve(0);
       }
     }).then( (result) => {
       return result;
     });

  }
   getLevel(levelCode: string) {
    return new Promise( (resolve) => {
      this.testService.getLevel(`?application_id=${
        this.applicationId}&test_level_code=${levelCode}`).subscribe( (oneLevel) => {
                resolve(oneLevel[0].test_level_title);
      });
    }).then( (result) => {
      return result;
    });

  }
  convertSessionTime(time) {
    const displayedHours = Math.floor(time / 3600) <= 9 ? '0' + Math.floor(time / 3600) : Math.floor(time / 3600);
    const displayedMinutes = Math.floor(time % 3600 / 60) <= 9 ? '0' + Math.floor(time / 60) : Math.floor(time / 60);
    const displayedSeconds = Math.floor(time % 3600 % 60) <= 9 ? '0' + Math.floor(time % 60) : Math.floor(time % 60);
    return displayedHours !== '00' ? displayedHours + 'h' :  displayedMinutes !== '00' ? displayedMinutes + 'min' : displayedSeconds + 'sec';
  }
}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from '@core/services/utils/utils.service';
import { UserService } from '@core/services/user/user.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { TestService } from '@core/services/test/test.service';
import { Router } from '@angular/router';

import { OverallTimerDialogComponent } from './overall-timer-dialog/overall-timer-dialog.component';

@Component({
  selector: 'wid-session-timer',
  templateUrl: './session-timer.component.html',
  styleUrls: ['./session-timer.component.scss']
})
export class SessionTimerComponent implements OnInit {
   totalQuestion: number;
   totalTime: number;
   totalPoints: number;
   totalTimeType: string;
   totalTimePerQuestions: number;
   totalTimePerQuestionsType: string;
   selectedTimerValue: any;
   sessionCode: any;
   companyEmailAddress: string;
   applicationId: string;
   languageId: string;
   selectedBlocArray = [];
   mode: string;
  constructor(
    private dialog: MatDialog,
    private utilsService: UtilsService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private testService: TestService,
    private route: Router,
  ) { }

  ngOnInit(): void {
    this.getData();
    this.getConnectedUser();
    this.getDataFromLocalStorage();
    this.getSessionTimeData();
  }

  chooseOverallTime() {
    const dialogRef = this.dialog.open(OverallTimerDialogComponent, {
      height: '353px',
      width: '607px',
      data: { totalTime: this.totalTime },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.totalTime = result;
        this.totalTimeType = 'min';
      } else {
        this.totalTimeType = this.totalTimePerQuestionsType;
        this.selectedTimerValue = 'time_per_question';
      }
    });
  }
  getData() {
    this.utilsService.verifyCurrentRoute('/manager/test/session-list').subscribe( (data) => {
      this.sessionCode = data.sessionCode;
      this.totalQuestion = data.totalQuestion;
      this.totalTime =   data.totalTime;
      this.totalTimePerQuestions = data.totalTime;
      this.totalTimePerQuestionsType = data.totalTimeType;
      this.totalTimeType = data.totalTimeType;
      this.totalPoints =   data.totalPoints;
      this.selectedBlocArray = data.selectedBlocs;
      this.mode = data.mode;
    });
  }
  chosenTime(event: any) {
    if (event.value === 'time_per_question') {
      this.totalTime = this.totalTimePerQuestions;
      this.totalTimeType = this.totalTimePerQuestionsType;
    }
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
    this.languageId = this.localStorageService.getItem('language').langId;
  }
  setSessionTime() {
    this.testService
      .getSessionInfo(`?company_email=${this.companyEmailAddress}&application_id=${this.applicationId}&session_code=${this.sessionCode}`)
      .subscribe( (result) => {
        const updateObject = result[0];
          updateObject.company_email =  this.companyEmailAddress;
          updateObject.application_id = this.applicationId;
          updateObject.session_code = this.sessionCode;
          updateObject.test_session_info_code = updateObject.TestSessionInfoKey.test_session_info_code;
        updateObject.test_session_timer_type = this.selectedTimerValue;
        updateObject.test_session_time = this.totalTimeType === 'h' ?
          this.totalTime  * 3600 : this.totalTimeType === 'min' ?
            this.totalTime * 60 : this.totalTime;
        this.testService.updateSessionInfo(updateObject).subscribe( (updatedSessionInfo) => {
          const queryObject = {
            sessionCode: this.sessionCode,
            mode: this.mode
          };
          this.utilsService.navigateWithQueryParam('/manager/test/invite-candidates', queryObject);
        });
    });
    }
  cancelOverallTime() {
    this.selectedTimerValue = 'time_per_question';
    this.totalTime = this.totalTimePerQuestions;
    this.totalTimeType = this. totalTimePerQuestionsType;
  }
  backToPreviousPage() {
    const queryObject = {
      sessionCode: this.sessionCode,
      selectedBlocs: this.selectedBlocArray,
      mode: this.mode
    };
    this.utilsService.navigateWithQueryParam('/manager/test/customize-session', queryObject);
  }
  getSessionTimeData() {
    if (this.sessionCode && this.sessionCode !== 'undefined') {
      this.testService
        .getSessionInfo(`?company_email=${
          this.companyEmailAddress}&application_id=${
          this.applicationId}&session_code=${
          this.sessionCode}`)
        .subscribe((sessionInfo) => {
          this.selectedTimerValue = sessionInfo[0].test_session_timer_type;
          if (this.selectedTimerValue === 'time_overall') {
            this.totalTime = this.getTime(Number(sessionInfo[0].test_session_time)).time;
            this.totalTimeType = this.getTime(sessionInfo[0].test_session_time).type;
          }
        });
    }
  }
  getTime(sumTime) {
    const displayedHours = Math.floor(sumTime / 3600) <= 9 ? Math.floor(sumTime / 3600) : Math.floor(sumTime / 3600);
    const displayedMinutes = Math.floor(sumTime % 3600 / 60) <= 9 ? Math.floor(sumTime / 60) : Math.floor(sumTime / 60);
    const displayedSeconds = Math.floor(sumTime % 3600 % 60) <= 9 ? Math.floor(sumTime % 60) : Math.floor(sumTime % 60);
    return  {
      time: displayedHours !== 0 ? displayedHours :  displayedMinutes !== 0 ? displayedMinutes : displayedSeconds,
      type: sumTime < 60 ? 'sec'  : sumTime < 3600 ? 'min' : 'h',
    };
  }
}

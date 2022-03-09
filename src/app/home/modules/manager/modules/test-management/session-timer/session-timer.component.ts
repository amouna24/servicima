import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from '@core/services/utils/utils.service';
import { UserService } from '@core/services/user/user.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { TestService } from '@core/services/test/test.service';

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
  constructor(
    private dialog: MatDialog,
    private utilsService: UtilsService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private testService: TestService,
  ) { }

  ngOnInit(): void {
    this.getData();
    this.getConnectedUser();
    this.getDataFromLocalStorage();
    this.selectedTimerValue = 'time_per_question';
  }

  chooseOverallTime() {
    const dialogRef = this.dialog.open(OverallTimerDialogComponent, {
      height: '353px',
      width: '607px',
      data: { totalTime: this.totalTime },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
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
    this.utilsService.verifyCurrentRoute('/manager/test/bloc-list').subscribe( (data) => {
      this.sessionCode = data.sessionCode;
      this.totalQuestion = data.totalQuestion;
      this.totalTime =   data.totalTime;
      this.totalTimePerQuestions = data.totalTime;
      this.totalTimePerQuestionsType = data.totalTimeType;
      this.totalTimeType = data.totalTimeType;
      this.totalPoints =   data.totalPoints;
    });
  }
  chosenTime(event: any) {
    if (event.value === 'time_per_question') {
      this.totalTime = this.totalTimePerQuestions;
      this.totalTimeType = this.totalTimePerQuestionsType;
    }
    console.log('event=', event);
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
        console.log(result);
        const updateObject = result[0];
          updateObject.company_email =  this.companyEmailAddress;
          updateObject.application_id = this.applicationId;
          updateObject.session_code = this.sessionCode;
          updateObject.test_session_info_code = updateObject.TestSessionInfoKey.test_session_info_code;
        updateObject.test_session_timer_type = this.selectedTimerValue;
        updateObject.test_session_time = this.totalTimeType === 'h' ?
          this.totalTime  * 3600 : this.totalTimeType === 'min' ?
            this.totalTime * 60 : this.totalTime;
        console.log('updated object', updateObject);
        this.testService.updateSessionInfo(updateObject).subscribe( (updatedSessionInfo) => {
          console.log(updatedSessionInfo , 'updated session');
        });
    });
    }
}

import { Component, OnInit } from '@angular/core';
import { TestService } from '@core/services/test/test.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { IAppLanguage } from '@shared/models/app-language';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { ILanguageModel } from '@shared/models/language.model';
import { ITestLevelModel } from '@shared/models/testLevel.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '@core/services/user/user.service';
import { ITestSessionModel } from '@shared/models/testSession.model';
import { Router } from '@angular/router';
import { ITestSessionInfoModel } from '@shared/models/testSessionInfo.model';

@Component({
  selector: 'wid-session-info',
  templateUrl: './session-info.component.html',
  styleUrls: ['./session-info.component.scss']
})
export class SessionInfoComponent implements OnInit {
 listLevel: ITestLevelModel[];
 listLanguage: ILanguageModel[];
 form: FormGroup;
 applicationId: string;
 companyEmailAddress: string;
 languageId: string;
  selectedBlocArray = [];
  blocTitles = [];
  sessionInfo: ITestSessionInfoModel;
  sessionCode: string;
  constructor(private testService: TestService,
              private utilsService: UtilsService,
              private userService: UserService,
              private localStorageService: LocalStorageService,
              private formBuilder: FormBuilder,
              private router: Router) {
    this.getSelectedBlocArray();
  }

  ngOnInit(): void {
    this.getDataFromLocalStorage();
    this.initForm();
    this.getConnectedUser();
    this.listLanguage = this.getLanguages();
    this.testService.getLevel(`?application_id=${this.applicationId}&language_id=${this.languageId}`).subscribe(data => {
      this.listLevel = data;
    });
    this.getSessionInfoData();
  }

  /**************************************************************************
   * @description get data from local storage
   *************************************************************************/
  getDataFromLocalStorage(): void {
    const userCredentials = this.localStorageService.getItem('userCredentials');
    this.applicationId = userCredentials?.application_id;
    this.languageId = this.localStorageService.getItem('language').langId;
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

  /**
   * @description : initialization of the form
   */
  initForm(): void {
    this.form = this.formBuilder.group({
      sessionName: ['', [Validators.required]],
      experienceRequired: ['', [Validators.required]],
      language: ['', [Validators.required]],
      copyPaste: ['', [Validators.required]],
      sendReport: ['', [Validators.required]],
    });
    this.getBlocsArray();
  }

  /**
   * Get the stored language from localStorage
   */
  getLanguages(): IAppLanguage[] {
    return this.localStorageService.getItem('languages');
  }

  addOrUpdateSessionInformation() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    } else {
      if (!this.sessionInfo) {
        const sessionObject: ITestSessionModel = {
          application_id: this.localStorageService.getItem('userCredentials').application_id,
          company_email: this.companyEmailAddress,
          session_code: `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-TEST-SESSION`,
          block_questions_code: this.selectedBlocArray.map( (oneBloc) => oneBloc).join(','),
        };
        this.testService.addSession(sessionObject).subscribe( (session) => {
          const testSessionInfo = {
            company_email: this.companyEmailAddress,
            application_id: this.applicationId,
            session_code: sessionObject.session_code, // à modifier
            test_session_info_code:  `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-TEST-SESSION-INFO`,
            session_name: this.form.controls.sessionName.value,
            test_session_timer_type: 'time_per_question',
            level_code: this.form.controls.experienceRequired.value,
            language_id: this.form.controls.language.value,
            copy_paste: this.form.controls.copyPaste.value,
            send_report: this.form.controls.sendReport.value
          };
          this.testService.addTestSessionInfo(testSessionInfo).subscribe((data) => {
            const queryObject = {
              selectedBlocs: this.selectedBlocArray,
              sessionCode: sessionObject.session_code
            };
            this.utilsService.navigateWithQueryParam('/manager/test/customize-session', queryObject);
            console.log(data, 'data');
          }, error => {
            console.error(error);
          });
        });
      } else {
        console.log('this.session info', this.sessionInfo);
        const updateSessionInfoObject: ITestSessionInfoModel = {
          _id: this.sessionInfo._id,
          TestSessionInfoKey: this.sessionInfo.TestSessionInfoKey,
          company_email: this.companyEmailAddress,
          application_id: this.applicationId,
          session_code: this.sessionInfo.TestSessionInfoKey.session_code, // à modifier
          test_session_info_code:  this.sessionInfo.TestSessionInfoKey.test_session_info_code,
          session_name: this.form.controls.sessionName.value,
          test_session_timer_type: this.sessionInfo.test_session_timer_type,
          level_code: this.form.controls.experienceRequired.value,
          test_session_time: this.sessionInfo.test_session_time,
          language_id: this.form.controls.language.value,
          copy_paste: this.form.controls.copyPaste.value,
          send_report: this.form.controls.sendReport.value
        };
        this.testService.updateSessionInfo(updateSessionInfoObject).subscribe( (sessionInfo) => {
          const queryObject = {
            selectedBlocs: this.selectedBlocArray,
            sessionCode: updateSessionInfoObject.session_code
          };
          this.utilsService.navigateWithQueryParam('/manager/test/customize-session', queryObject);
        });
      }
    }
  }
  backToPreviousPage() {
      const queryObject = {
        selectedBlocs: this.selectedBlocArray,
        sessionCode: this.sessionCode
      };
      this.utilsService.navigateWithQueryParam('/manager/test/bloc-list', queryObject);
  }
  getSelectedBlocArray() {
    this.utilsService.verifyCurrentRoute('/manager/test/bloc-list').subscribe( (data) => {
      console.log('data=', data.route);
        this.selectedBlocArray = data.selectedBlocs.split(',');
        this.sessionCode = data.sessionCode;
    });
  }
  getBlocsArray() {
    this.blocTitles = [];
      this.selectedBlocArray.forEach( (blocQuestionCode) => {
        this.testService.getQuestionBloc(`?test_question_bloc_code=${blocQuestionCode}`)
          .subscribe( (resNode) => {
                this.blocTitles.push({
                  title: resNode['results'][0].test_question_bloc_title,
                  code: blocQuestionCode
                });
              });
          });
    }
    getSessionInfoData() {
      console.log('session code', this.sessionCode);
    if (this.sessionCode && this.sessionCode !== 'undefined') {
      this.testService
        .getSessionInfo(`?company_email=${
          this.companyEmailAddress}&application_id=${
          this.applicationId}&session_code=${
          this.sessionCode}`)
        .subscribe( (sessionInfo) => {
          console.log('copy paste=', sessionInfo[0].send_report);
          this.sessionInfo = sessionInfo[0];
          this.form.patchValue(
            {
              sessionName: sessionInfo[0].session_name,
              experienceRequired: sessionInfo[0].level_code,
              language: sessionInfo[0].language_id,
              copyPaste: sessionInfo[0].copy_paste,
              sendReport: sessionInfo[0].send_report,
            });
        });
    }
    }
}

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
  constructor(private testService: TestService,
              private utilsService: UtilsService,
              private userService: UserService,
              private localStorageService: LocalStorageService,
              private formBuilder: FormBuilder, ) {
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

  addSessionInformation() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    } else {
      const sessionObject: ITestSessionModel = {
        application_id: this.localStorageService.getItem('userCredentials').application_id,
        company_email: this.companyEmailAddress,
        session_code: `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-TEST-SESSION`,
        block_questions_code: this.selectedBlocArray.map( (oneBloc) => oneBloc).join(','),
      };
      this.testService.addSession(sessionObject).subscribe( (session) => {
        console.log('session created');
        const testSessionInfo = {
          company_email: this.companyEmailAddress,
          application_id: this.applicationId,
          session_code: sessionObject.session_code, // à modifier
          test_session_info_code:  `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-TEST-SESSION-INFO`,
          session_name: this.form.controls.sessionName.value,
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

    }
  }
  getSelectedBlocArray() {
    this.utilsService.verifyCurrentRoute('/manager/test/bloc-list').subscribe( (data) => {
      this.selectedBlocArray = data.selectedBlocs.split(',');
    });
  }
  getBlocsArray() {
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

}

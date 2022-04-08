import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TestService } from '@core/services/test/test.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { IAppLanguage } from '@shared/models/app-language';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { ILanguageModel } from '@shared/models/language.model';
import { ITestLevelModel } from '@shared/models/testLevel.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '@core/services/user/user.service';
import { ITestSessionModel } from '@shared/models/testSession.model';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ITestSessionInfoModel } from '@shared/models/testSessionInfo.model';

import { ITestQuestionBlocModel } from '@shared/models/testQuestionBloc.model';
import { IViewParam } from '@shared/models/view.model';
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
  availableBlocQuestionsList = [];
  blocTitles = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  msgCodeError = '';
  separatorKeysCodes = [ENTER, COMMA];
  technologyCtrl = new FormControl();
  filteredTechnology: Observable<any[]>;
  technologies: IViewParam[] = [];
  allTechnology: IViewParam[] = [];

  @ViewChild('technologyInput') technologyInput: ElementRef;

  sessionInfo: ITestSessionInfoModel;
  sessionCode: string;
  mode: string;
  constructor(private testService: TestService,
              private utilsService: UtilsService,
              private userService: UserService,
              private localStorageService: LocalStorageService,
              private formBuilder: FormBuilder,
              private router: Router) {
    this.getSelectedBlocArray();
    this.filteredTechnology = this.technologyCtrl.valueChanges.pipe(
      startWith(null as any),
      map((technology: string | null) => technology ? this.filter(technology) : this.allTechnology.slice()));

  }

  /**
   * @description Loaded when component in init state
   */
  async ngOnInit() {
    this.getDataFromLocalStorage();
    this.initForm();
    this.getConnectedUser();
    this.listLanguage = this.getLanguages();
    this.testService.getLevel(`?application_id=${this.applicationId}&language_id=${this.languageId}`).subscribe(data => {
      this.listLevel = data.sort((a, b) => (a.TestLevelKey.test_level_code > b.TestLevelKey.test_level_code ? 1 : -1));
    });
    this.getSessionInfoData();
    await this.getBlocQuestions();
    this.mapQuestion();
  }

  /**
   * @description Get connected user
   */
  getConnectedUser() {
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.companyEmailAddress = userInfo['company'][0]['companyKey']['email_address'];
          }
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
   * @description : initialization of the form
   */
  initForm(): void {
    this.form = this.formBuilder.group({
      sessionName: ['', [Validators.required]],
      experienceRequired: ['', [Validators.required]],
      language: ['', [Validators.required]],
      minimalScore: ['', [Validators.required, Validators.max(100), Validators.min(0)]],
      copyPaste: ['', [Validators.required]],
      sendReport: ['', [Validators.required]],
    });
    this.blocTitles = [];
    this.getBlocsArray();
  }

  /**
   * Get the stored language from localStorage
   */
  getLanguages(): IAppLanguage[] {
    return this.localStorageService.getItem('languages');
  }
  /**
   * @description : Add technology
   * @param event: MatChipInputEvent
   */
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    const addTechnology = this.allTechnology.filter((technology) => {
      if (technology['viewValue'].toLowerCase() === value.toLowerCase()) {
        return technology;
      }
    });

    if (addTechnology.length > 0 && (value || '').trim()) {
        const checkExist = this.technologies.find((tech) => tech.value === this.technologyCtrl.value);
        if (!checkExist) {
          this.technologies.push(addTechnology[0]);
          this.msgCodeError = '';
          const index = this.allTechnology.indexOf(addTechnology[0]);
          if (index >= 0) {
            this.allTechnology = this.allTechnology.filter((data) => {
              if (value.toLowerCase() !== data.viewValue.toLowerCase()) {
                return data;
              }
            });
          }
        } else {
          this.msgCodeError = 'cette technologie n\'existe pas ou deja existe';
        }
      } else {
      input.value = '';
      this.msgCodeError = 'cette technologie n\'existe pas ou deja existe';
    }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.technologyCtrl.setValue(null);

  }

  /**
   * @description : remove technology
   * @param technology: IViewParam
   */
  remove(technology: IViewParam): void {
    if (this.technologies.length > 1) {
      const index = this.technologies.indexOf(technology);

      if (index >= 0) {
        this.technologies.splice(index, 1);
        this.allTechnology.push(technology);
      }
    } else {
      this.msgCodeError = 'il faut avoir au moins une technologie';
    }
  }

  /**
   * @description : filter technology
   * @param name: string
   */
  filter(name: string) {
    return this.allTechnology.filter(technology => {
      return technology.viewValue.toLowerCase().indexOf(name.toLowerCase()) === 0;
    });
  }

  /**
   * @description : select technology from autocomplete
   * @param event: MatAutocompleteSelectedEvent
   */
  selected(event: MatAutocompleteSelectedEvent): void {
    const checkExist = this.technologies.find((tech) => tech.value === this.technologyCtrl.value);
    if (!checkExist) {
      this.msgCodeError = '';
      this.technologies.push({
        value: event.option.value,
        viewValue: event.option.viewValue
      });

      const index = this.allTechnology.indexOf(event.option);
      if (index === -1) {
        this.allTechnology = this.allTechnology.filter((data) => {
          if (data.value !== event.option.value) {
            return data;
          }
        });
      }

    } else {
      this.msgCodeError = 'cette technologie n\'existe pas ou deja existe';
    }
    this.technologyInput.nativeElement.value = '';
    this.technologyCtrl.setValue(null);
  }

  /**
   * @description : get block question
   */
  getBlocQuestions() {
    return new Promise((resolve) => {
      let i = 0;
      this.testService.getQuestionBloc(
        `?company_email=ALL&application_id=${this.utilsService.
          getApplicationID('SERVICIMA')}`)
        .subscribe((resBlocQuestions) => {
          resBlocQuestions['results'].map((oneBloc: ITestQuestionBlocModel) => {
            this.testService.getQuestion(`?test_question_bloc_code=${oneBloc.TestQuestionBlocKey.test_question_bloc_code}`)
              .subscribe((questions) => {
                i++;
                if (!questions['msg_code']) {
                  if (oneBloc.free) {
                    this.availableBlocQuestionsList.push(oneBloc);
                  }
                }
                if (i === resBlocQuestions['results'].length) {
                  resolve(this.availableBlocQuestionsList);
                }
              });

          });
        });
    });
  }

  /**
   * @description : map questions
   */
  mapQuestion() {
    const allTechnologyAvailable = [];
    this.availableBlocQuestionsList.map((questionBloc) => {
      allTechnologyAvailable.push({
        value: questionBloc.TestQuestionBlocKey.test_question_bloc_code,
        viewValue: questionBloc.test_question_bloc_title
      });
    });
    this.allTechnology = _.differenceBy(allTechnologyAvailable, this.technologies, 'value');
  }

  /**
   * @description : add session information
   */
  addOrUpdateSessionInformation() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    } else {
      if (!this.sessionInfo) {
        const sessionObject: ITestSessionModel = {
          application_id: this.localStorageService.getItem('userCredentials').application_id,
          company_email: this.companyEmailAddress,
          session_code: `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-TEST-SESSION`,
          block_questions_code: this.technologies.map((oneBloc) => oneBloc.value).join(','),
        };
        this.testService.addSession(sessionObject).subscribe( (session) => {
          const testSessionInfo = {
            company_email: this.companyEmailAddress,
            application_id: this.applicationId,
            session_code: sessionObject.session_code, // à modifier
            test_session_info_code:  `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-TEST-SESSION-INFO`,
            session_name: this.form.controls.sessionName.value,
            test_session_timer_type: 'time_per_question',
            test_session_time: 0,
            minimal_score: this.form.controls.minimalScore.value,
            level_code: this.form.controls.experienceRequired.value,
            language_id: this.form.controls.language.value,
            copy_paste: this.form.controls.copyPaste.value,
            send_report: this.form.controls.sendReport.value
          };
          this.testService.addTestSessionInfo(testSessionInfo).subscribe((data) => {
            const queryObject = {
              selectedBlocs: this.technologies.map( (tech) =>  tech.value),
              sessionCode: sessionObject.session_code,
              mode: this.mode,
            };
            this.utilsService.navigateWithQueryParam('/manager/test/customize-session', queryObject);
            console.log(data, 'data');
          }, error => {
            console.error(error);
          });
        });
      } else {
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
          minimal_score: this.form.controls.minimalScore.value,
          test_session_time: this.sessionInfo.test_session_time,
          language_id: this.form.controls.language.value,
          copy_paste: this.form.controls.copyPaste.value,
          send_report: this.form.controls.sendReport.value
        };
        this.testService.updateSessionInfo(updateSessionInfoObject).subscribe( (sessionInfo) => {
          const queryObject = {
            selectedBlocs: this.technologies.map( (tech) =>  tech.value),
            sessionCode: updateSessionInfoObject.session_code,
            mode: this.mode
          };
          this.utilsService.navigateWithQueryParam('/manager/test/customize-session', queryObject);
        });
      }
    }
  }
  backToPreviousPage() {
      const queryObject = {
        selectedBlocs: this.technologies.map( (tech) =>  tech.value),
        sessionCode: this.sessionCode
      };
      this.utilsService.navigateWithQueryParam('/manager/test/bloc-list', queryObject);
  }

  /**
   * @description : get selected block
   */
  getSelectedBlocArray() {
      this.utilsService.verifyCurrentRoute('/manager/test/session-list').subscribe((data) => {
        this.selectedBlocArray = data.selectedBlocs.split(',');
        this.sessionCode = data.sessionCode;
        this.mode = data.mode;
      });
  }

  /**
   * @description : get blocs
   */
  getBlocsArray() {
    this.selectedBlocArray.forEach((blocQuestionCode) => {
      this.testService.getQuestionBloc(`?test_question_bloc_code=${blocQuestionCode}`)
        .subscribe((resNode) => {
          this.blocTitles.push({
            viewValue: resNode['results'][0].test_question_bloc_title,
            value: blocQuestionCode
          });
          this.technologies = this.blocTitles;
        });

    });
  }
  getSessionInfoData() {
    if (this.sessionCode && this.sessionCode !== 'undefined') {
      this.testService
        .getSessionInfo(`?company_email=${
          this.companyEmailAddress}&application_id=${
          this.applicationId}&session_code=${
          this.sessionCode}`)
        .subscribe( (sessionInfo) => {
          this.sessionInfo = sessionInfo[0];
          this.form.patchValue(
            {
              sessionName: sessionInfo[0].session_name,
              experienceRequired: sessionInfo[0].level_code,
              language: sessionInfo[0].language_id,
              copyPaste: sessionInfo[0].copy_paste,
              minimalScore: sessionInfo[0].minimal_score,
              sendReport: sessionInfo[0].send_report,
            });
        });
    }
    }
}

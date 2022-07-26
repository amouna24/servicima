import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { IResumeLanguageModel } from '@shared/models/resumeLanguage.model';
import { UserService } from '@core/services/user/user.service';
import { Subscription } from 'rxjs';
import { IViewParam } from '@shared/models/view.model';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { ModalService } from '@core/services/modal/modal.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { blueToGrey, downLine, GreyToBlue, showBloc, dataAppearance } from '@shared/animations/animations';

@Component({
  selector: 'wid-resume-language',
  templateUrl: './resume-language.component.html',
  styleUrls: ['./resume-language.component.scss'],
  animations: [
    blueToGrey,
    GreyToBlue,
    downLine,
    dataAppearance,
    showBloc

  ],
})
export class ResumeLanguageComponent implements OnInit {
  sendLanguage: FormGroup;
  rating = 0;
  ratingEdit: number[];
  starCount = 5;
  ratingArr: number[];
  arrayLanguageCount = 0;
  language: IResumeLanguageModel;
  languageUpdate: IResumeLanguageModel;
  languageArray: IResumeLanguageModel[];
  langList: IViewParam[];
  resumeCode: string;
  refData: { } = { };
  emailAddress: string;
  showLevelError: boolean;
  langListRes: IViewParam[];
  subscriptionModal: Subscription;
  button: string;
  companyUserType: string;
  featureAddUpdate: any;
  constructor(
    private utilService: UtilsService,
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private userService: UserService,
    private appInitializerService: AppInitializerService,
    private refDataService: RefdataService,
    private modalServices: ModalService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private router: Router,
  ) {
    this.resumeCode = this.router.getCurrentNavigation()?.extras?.state?.resumeCode;
    this.companyUserType = this.router.getCurrentNavigation()?.extras?.state?.companyUserType;
  }
  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  async ngOnInit() {
    this.button = this.resumeCode ? 'Save' : 'Next';
    this.ratingArr = [];
    this.languageArray = [];
    this.ratingEdit = [];
    this.langListRes = [];
    this.showLevelError = false;
    this.featureAddUpdate = 'RESUME_ADD_LANGUAGE';
    this.getConnectedUser();
    this.createForm();
    await this.getLanguageRefData();
    this.getLanguageInfo();
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
    this.matIconRegistry.addSvgIcon(
      'close',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/close.svg')
    );
  }
  /**************************************************************************
   * @description set Language RefData in a language List
   *************************************************************************/
  async getLanguageRefData() {
    const data = await this.getRefData();
    this.langList = data['LANGUAGE'];
  }
  /**************************************************************************
   * @description Get Languages from Ref Data
   * @return refData return language refData
   *************************************************************************/
  async getRefData() {
    const list = ['LANGUAGE'];
    this.refData = await this.refDataService
      .getRefData(this.utilService.getCompanyId(this.emailAddress, this.userService.applicationId), this.userService.applicationId,
        list, false);
    return this.refData;
  }
  /**************************************************************************
   * @description get Email address from Connected User
   *************************************************************************/
  getConnectedUser() {
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.emailAddress = userInfo['company'][0]['companyKey']['email_address'];
          }
        });
  }
  /**************************************************************************
   * @description get the rating added by the candidate
   *************************************************************************/
  onClick(rating: number) {
    this.rating = rating;
    return false;
  }
  /**************************************************************************
   * @description show Rating that are already exists in database
   * @param level level of the existing language
   * @param index index of the language
   * @return star return a filled or  empty star
   *************************************************************************/
  showIconDisabled(level: number, index: number) {
    if (level >= index + 1) {
      return 'assets/icons/star_yellow.svg';
    } else {
      return 'assets/icons/star_yellow_empty.svg';
    }
  }
  /**************************************************************************
   * @description Select Level by clicking on the stars
   * @param index index of the language
   * @return start return a filled or empty star
   *************************************************************************/
  showIcon(index: number): string {
    if (this.rating >= index + 1) {
      return 'assets/icons/star.svg';
    } else {
      return 'assets/icons/star_border.svg';
    }
  }
  /**************************************************************************
   * @description initialize a Language Form
   *************************************************************************/
  createForm() {
    this.sendLanguage = this.fb.group({
      resume_language_code: ['', [Validators.required]],
    });
  }
  /*************************************************************************
   * @description Create new Language
   ***********************************************************************/
  createLanguage() {
    this.language = this.sendLanguage.value;
    this.language.level = this.rating.toString();
    this.language.resume_code = this.resumeCode.toString();
    if (this.sendLanguage.valid && this.rating > 0) {
      this.resumeService.addLanguage(this.language).subscribe(data => {
        this.resumeService.getLanguage(
          `?resume_language_code=${this.language.resume_language_code}&resume_code=${this.resumeCode}`)
          .subscribe(
            (responseOne) => {
              if (responseOne['msg_code'] !== '0004') {
                responseOne[0].resume_language_code = responseOne[0].ResumeLanguageKey.resume_language_code;
                this.ratingEdit.push(+this.language.level);
                this.langList.forEach((value, index) => {
                  if (value.value === responseOne[0].resume_language_code) {
                    this.langListRes.push(value);
                    this.langList.splice(index, 1);
                  }});
                this.languageArray.push(responseOne[0]);
              }});     });
    } else {
      this.showLevelError = true;
    }
    this.arrayLanguageCount++;
    this.sendLanguage.reset();
    this.rating = 0;
  }
  /**************************************************************************
   * @description  Update a language by clicking on the stars
   * @param rating the rating selected by the candidate
   * @param pointIndex the index of the language selected
   * @param language the language model
   *************************************************************************/
  updateLanguage(rating: number, pointIndex: number, language: IResumeLanguageModel): boolean {
    this.ratingEdit[pointIndex] = rating;
    this.languageUpdate = ({
      _id: language._id,
      ResumeLanguageKey: language.ResumeLanguageKey,
      resume_language_code: language.ResumeLanguageKey.resume_language_code,
      level: rating.toString(),
      resume_code: this.resumeCode,
    });
    this.resumeService.updateLanguage(this.languageUpdate).subscribe(data => console.log('language updated =', data));
    return false;
  }
  /**************************************************************************
   * @description Get Language Data from Resume Service
   *************************************************************************/
  getLanguageInfo() {
    if (this.resumeCode) {
      this.resumeService.getLanguage(
        `?resume_code=${this.resumeCode}`)
        .subscribe(
          (responseOne) => {
            if (responseOne['msg_code'] !== '0004') {
              this.languageArray = responseOne;
              this.languageArray.forEach(
                (lang) => {
                  this.ratingEdit.push(+lang.level);
                  lang.resume_language_code = lang.ResumeLanguageKey.resume_language_code;
                  this.langList.forEach((value, index) => {
                    if (value.value === lang.resume_language_code) {
                      this.langListRes.push(value);
                      this.langList.splice(index, 1);
                    }
                  });
                });
            }
          },
          (error) => {
            if (error.error.msg_code === '0004') {
            }
          },
        );
    } else if (this.userService.connectedUser$.getValue().user[0].user_type === 'COMPANY' && !this.resumeCode) {
      this.router.navigate(['manager/resume/']);
    } else if (this.userService.connectedUser$.getValue().user[0].user_type === 'CANDIDATE' ||
      this.userService.connectedUser$.getValue().user[0].user_type === 'COLLABORATOR') {
      this.resumeService.getResume(
        `?email_address=${this.userService.connectedUser$
          .getValue().user[0]['userKey']['email_address']}&company_email=${this.userService.connectedUser$
          .getValue().user[0]['company_email']}`)
        .subscribe(
          (response) => {
            if (response['msg_code'] !== '0004') {
              this.resumeCode = response[0].ResumeKey.resume_code.toString();
              this.resumeService.getLanguage(
                `?resume_code=${this.resumeCode}`)
                .subscribe(
                  (responseOne) => {
                    if (responseOne['msg_code'] !== '0004') {
                      this.languageArray = responseOne;
                      this.languageArray.forEach(
                        (lang) => {
                          this.ratingEdit.push(+lang.level);
                          lang.resume_language_code = lang.ResumeLanguageKey.resume_language_code;
                          this.langList.forEach((value, index) => {
                            if (value.value === lang.resume_language_code) {
                              this.langListRes.push(value);
                              this.langList.splice(index, 1);
                            }
                          });
                        });
                    }
                  },
                  (error) => {
                    if (error.error.msg_code === '0004') {
                    }
                  },
                );
            } else {
              this.router.navigate(['/candidate/resume/']);
            }
          },
          (error) => {
            if (error.error.msg_code === '0004') {
            }
          },
        );
    }
  }
  /**************************************************************************
   * @description Delete Selected Languages
   *************************************************************************/
  deleteLanguage(id: string, pointIndex: number) {
    const confirmation = {
      code: 'delete',
      title: 'resume-delete-language',
      description: 'resume-u-sure',
    };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .subscribe(
        (res) => {
          if (res === true) {
            this.resumeService.deleteLanguage(id).subscribe(data => {
              console.log('Deleted', data);
              this.languageArray.forEach((lang, indexLang) => {
                if (indexLang === pointIndex) {
                  this.languageArray.splice(indexLang, 1);
                  this.langListRes.forEach((value, index) => {
                    if (value.value === lang.resume_language_code) {
                      this.langList.push(value);
                      this.langListRes.splice(index, 1);
                    }
                  });
                }
              });
            });
          }
          this.subscriptionModal.unsubscribe();
        }
      );
  }
  /**************************************************************************
   * @description Show indexation
   *************************************************************************/
  addIndexation() {
    const indexationArray = [];
    for (let i = 1; i < 10; i++) {
      indexationArray[i] = '0' + i.toString();
    }
    return(indexationArray);
  }
  /**************************************************************************
   * @description Route to next page or to the previous page
   * @param typeRoute type of route previous or next
   *************************************************************************/
  routeNextBack(typeRoute: string) {
    if (this.userService.connectedUser$.getValue().user[0].user_type === 'COMPANY') {
      if (typeRoute === 'next') {
        this.router.navigate(['/manager/resume/done'], {
          state: {
            resumeCode: this.resumeCode,
            companyUserType: this.companyUserType,
          }
        });
      } else {
        this.router.navigate(['/manager/resume/dynamicSection'], {
          state: {
            resumeCode: this.resumeCode,
            companyUserType: this.companyUserType,
          }
        });
      }
    } else if (this.userService.connectedUser$.getValue().user[0].user_type === 'CANDIDATE') {
      if (typeRoute === 'next') {
        this.router.navigate(['/candidate/resume/done'], {
          state: {
            resumeCode: this.resumeCode
          }
        });
      } else {
        this.router.navigate(['/candidate/resume/dynamicSection'], {
          state: {
            resumeCode: this.resumeCode
          }
        });
      }
    } else {
      if (typeRoute === 'next') {
        this.router.navigate(['/collaborator/resume/done'], {
          state: {
            resumeCode: this.resumeCode
          }
        });
      } else {
        this.router.navigate(['/collaborator/resume/dynamicSection'], {
          state: {
            resumeCode: this.resumeCode
          }
        });
      }
    }
  }
  checkFormValues(typeRoute: string) {
    let notEmptyForm = false;
    Object.values(this.sendLanguage.controls).some(({ value }) => {
      if (value) {
        notEmptyForm = true;
      }
    });
    if (!notEmptyForm) {
      this.routeNextBack(typeRoute);
    } else {
      const confirmation = {
        code: 'confirmation',
        title: 'resume-not-saved',
        description: typeRoute === 'next' ? `resume-next-page` : `resume-previoous-page`,
      };
      this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
        .subscribe(
          (res) => {
            if (res === true) {
              this.routeNextBack(typeRoute);
            }
            this.subscriptionModal.unsubscribe();
          }
        );
    }
  }

}

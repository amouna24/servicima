import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ResumeService} from '@core/services/resume/resume.service';
import {IResumeLanguageModel} from '@shared/models/resumeLanguage.model';
import {UserService} from '@core/services/user/user.service';
import {Subscription} from 'rxjs';
import {IViewParam} from '@shared/models/view.model';
import {AppInitializerService} from '@core/services/app-initializer/app-initializer.service';
import {RefdataService} from '@core/services/refdata/refdata.service';
import {UtilsService} from '@core/services/utils/utils.service';
import {ModalService} from '@core/services/modal/modal.service';
import {IResumeLanguageKeyModel} from '@shared/models/resumeLanguageKey.model';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'wid-resume-language',
  templateUrl: './resume-language.component.html',
  styleUrls: ['./resume-language.component.scss']
})
export class ResumeLanguageComponent implements OnInit {
  constructor(
    private utilService: UtilsService,
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private userService: UserService,
    private appInitializerService: AppInitializerService,
    private refdataService: RefdataService,
    private modalServices: ModalService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {
  }
  get getLanguage() {
    return this.languageArray;
  }
  sendLanguage: FormGroup;
  rating = 0;
  ratingEdit: number[] = [];
  starCount = 5;
  ratingArr = [];
  arrayLanguageCount = 0;
  language: IResumeLanguageModel;
  languageUpdate: IResumeLanguageModel;
  languageArray: IResumeLanguageModel[] = [];
  langList: IViewParam[];
  resume_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-LANG`;
  refData: { } = { };
  emailAddress: string;
  showLevelError = false;
  langListRes: IViewParam[] = [];
  subscriptionModal: Subscription;
  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  async ngOnInit() {
    this.getConnectedUser();
    this.createForm();
    await this.getLanguageRefData();
    /********************************** LANGUAGE **********************************/
    this.getLanguageInfo();
    console.log('a ' + this.starCount);
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
    console.log(this.ratingArr);
    this.matIconRegistry.addSvgIcon(
      'close',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/close.svg')
    );
  }
  /**************************************************************************
   * @description set Language RefData in a language List
   *************************************************************************/
  async getLanguageRefData() {
    const data = await this.getRefdata();
    this.langList = data['LANGUAGE'];
    console.log(this.langList);
  }
  /**************************************************************************
   * @description Get Languages from Ref Data
   *************************************************************************/
  async getRefdata() {
    const list = ['LANGUAGE'];
    this.refData =  await this.refdataService
      .getRefData( this.utilService.getCompanyId(this.emailAddress, this.userService.applicationId) , this.userService.applicationId,
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

  onClick(rating: number) {
    console.log(rating);
    this.rating = rating;
    return false;
  }
  showValidateIcon(index: number) {
    const i = 0;
    if (i >= index ) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
  /**************************************************************************
   * @description Select Level by clicking on the stars
   *************************************************************************/
  showIconDisabled(level: number, index: number) {
    if (level >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
  showIcon(index: number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
  /**
   * @description initialize a Language Form
   */
  createForm() {
    this.sendLanguage = this.fb.group({
          resume_language_code:  ['', [Validators.required]],
        });
  }
  /**
   * @description Create new Language
   */
  createLanguage() {
    this.language = this.sendLanguage.value;
    this.language.level = this.translateLevel(this.rating.toString());
    this.language.resume_code = this.resume_code.toString();
    if (this.sendLanguage.valid && this.rating > 0) {
      console.log(this.language);
      this.resumeService.addLanguage(this.language).subscribe(data => {
        console.log('Technical skill =', data);
        this.ratingEdit = [];
        this.getLanguageInfo();
      });
    } else { console.log('Form is not valid');
      this.showLevelError = true;
    }
    this.arrayLanguageCount++;
    this.sendLanguage.reset();
    this.rating = 0;
  }
  /**************************************************************************
   * @description  Update a language by clicking on the stars
   *************************************************************************/
  updateLanguage(rating: number, pointIndex: number, resume_language_code: string, _id: string, ResumeLanguageKey: IResumeLanguageKeyModel) {
    this.ratingEdit[pointIndex] = rating;
    this.languageUpdate = ({
      _id,
      ResumeLanguageKey,
      resume_language_code,
      level: rating.toString(),
      resume_code: this.resume_code,
    });
    this.resumeService.updateLanguage(this.languageUpdate).subscribe(data => console.log('functional skill updated =', data));
    return false;
  }
  /**************************************************************************
   * @description Get Language Data from Resume Service
   *************************************************************************/
  getLanguageInfo() {
    this.resumeService.getResume(
      // tslint:disable-next-line:max-line-length
      `?email_address=${this.userService.connectedUser$.getValue().user[0]['userKey']['email_address']}&company_email=${this.userService.connectedUser$.getValue().user[0]['company_email']}`)
      .subscribe(
        (response) => {
          this.resume_code = response[0].ResumeKey.resume_code.toString();
          console.log('resume code 1 =', this.resume_code);
          this.resumeService.getLanguage(
            `?resume_code=${this.resume_code}`)
            .subscribe(
              (responseOne) => {
                if (responseOne['msg_code'] !== '0004') {

                  console.log('response', responseOne);
                  this.languageArray = responseOne;
                  this.languageArray.forEach(
                    (lang) => {
                      this.ratingEdit.push(+lang.level);
                      lang.resume_language_code = lang.ResumeLanguageKey.resume_language_code;
                      this.langList.forEach((value, index) => {
                        if (value.value === lang.resume_language_code) {
                          this.langListRes.push(value);
                          this.langList.splice(index, 1);
                          console.log('index', index); }
                      });
                    });
                  console.log('langlist', this.langList);
                }},
              (error) => {
                if (error.error.msg_code === '0004') {
                }
              },
            );
        },
        (error) => {
          if (error.error.msg_code === '0004') {
          }
        },
      );

  }
  /**************************************************************************
   * @description Delete Selected Languages
   *************************************************************************/
 deleteLanguage(_id: string, pointIndex: number) {
    const confirmation = {
      code: 'delete',
      title: 'Delete This Language?',
    };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .subscribe(
        (res) => {
          if (res === true) {
            this.resumeService.deleteLanguage(_id).subscribe(data => console.log('Deleted'));
            this.languageArray.forEach((lang, indexlang) => {
              if (indexlang === pointIndex) { this.languageArray.splice(indexlang, 1);
                console.log('lang List Res', this.langListRes);
                   this.langListRes.forEach((value, index) => {
                                  if (value.value === lang.resume_language_code) {
                                    this.langList.push(value);
                                    this.langListRes.splice(index, 1);
                                    }}); }
            });
          }
          this.subscriptionModal.unsubscribe();
        }
      );
  }
  translateLevel(level: string) {
   switch (level) {
     case '5': return 'Tres Bien';
     case '4': return 'Bien';
     case  '3': return 'Suffisant';
     case '2': return 'mediocre';
     case '1': return 'Mauvais';
   }
  }

}

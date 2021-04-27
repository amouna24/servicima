import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup , FormArray } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { IResumeLanguageModel } from '@shared/models/resumeLanguage.model';
import { UserService } from '@core/services/user/user.service';
import { BehaviorSubject } from 'rxjs';
import { IViewParam } from '@shared/models/view.model';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';

@Component({
  selector: 'wid-resume-language',
  templateUrl: './resume-language.component.html',
  styleUrls: ['./resume-language.component.scss']
})
export class ResumeLanguageComponent implements OnInit {
  sendLanguage: FormGroup;
  rating = 0;
  starCount = 5;
  ratingArr = [];
  arrayLanguageCount = 0;
  language: IResumeLanguageModel;
  languageArray: IResumeLanguageModel[] = [];
  langList: BehaviorSubject<IViewParam[]> = new BehaviorSubject<IViewParam[]>([]);
  resume_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-LANG`;
  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private userService: UserService,
    private appInitializerService: AppInitializerService,
  ) {
  }
  get getLanguage() {
    return this.languageArray;
  }

  ngOnInit() {
    this.createForm();
    /********************************** LANGUAGE **********************************/
    this.langList.next(this.appInitializerService.languageList.map(
      (obj) => {
        return  { value: obj.LanguageKey.language_code, viewValue: obj.language_desc };
      }
    ));
    this.getLanguageInfo();
    console.log('a ' + this.starCount);
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }

    console.log(this.ratingArr);
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
   * @description Create Form
   */
  createForm() {
    this.sendLanguage = this.fb.group({
          resume_language_code: '',
        });
  }
  /**
   * @description Create Language
   */
  createLanguage() {
    this.language = this.sendLanguage.value;
    this.language.level = this.rating.toString();
    this.language.resume_code = this.resume_code.toString();
    if (this.sendLanguage.valid) {
      console.log(this.language);
      this.resumeService.addLanguage(this.language).subscribe(data => console.log('Language=', data));
      this.languageArray.push(this.language);
    } else { console.log('Form is not valid');
    }
    this.arrayLanguageCount++;
    this.sendLanguage.reset();
    this.rating = 0;
  }
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
                console.log('response', responseOne);
                this.languageArray = responseOne;
              },
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
}

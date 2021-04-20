import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup , FormArray } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { IResumeLanguageModel } from '@shared/models/resumeLanguage.model';
import {UserService} from "@core/services/user/user.service";

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
  resume_code: string;
  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private userService: UserService,
  ) {
  }
  get getLanguage() {
    return this.languageArray;
  }

  ngOnInit() {
    this.createForm();
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
    const i = 2;
    if (i >= index ) {
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

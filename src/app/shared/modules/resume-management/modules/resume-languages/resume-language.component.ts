import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup , FormArray } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ResumeService } from '@core/services/resume/resume.service';
import { IResumeLanguageModel } from '@shared/models/resumeLanguage.model';

@Component({
  selector: 'wid-resume-language',
  templateUrl: './resume-language.component.html',
  styleUrls: ['./resume-language.component.scss']
})
export class ResumeLanguageComponent implements OnInit {
  sendLanguage: FormGroup;
  rating = 0;
  starCount = 5;
  color: ThemePalette = 'accent';
  ratingArr = [];
  arrayLanguageCount = 0;
  language: IResumeLanguageModel;
  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
  ) {
  }

  get inputFields() {
    return this.sendLanguage.get('Field') as FormArray;
  }
  ngOnInit() {
    this.createForm();
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
      Field: this.fb.array([this.fb.group(
        {
          resume_language_code: '',
          resume_code : Math.random().toString(),
          level : '',
        })])});
  }
  /**
   * @description Create Language
   */
  createLanguage() {
    this.language = this.sendLanguage.controls.Field.value;
    this.language[this.arrayLanguageCount].level = this.rating.toString();
    this.language[this.arrayLanguageCount].resume_code = Math.random();
    if (this.sendLanguage.controls.Field.valid) {
      console.log('table language', this.language[this.arrayLanguageCount], 'index=', this.arrayLanguageCount);
      this.resumeService.addLanguage(this.language[this.arrayLanguageCount]).subscribe(data => console.log('Language=', data));
      this.inputFields.push(this.fb.group({
        resume_language_code: '',
        resume_code : Math.random().toString(),
        level : this.rating}));

    } else { console.log('Form is not valid');
    }
    this.arrayLanguageCount++;

  }
}

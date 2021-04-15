import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IResumeLanguageModel } from '@shared/models/resumeLanguage.model';
import { ResumeService } from '@core/services/resume/resume.service';

@Component({
  selector: 'wid-languageform',
  templateUrl: './languageform.component.html',
  styleUrls: ['./languageform.component.scss']
})
export class LanguageformComponent implements OnInit {

  rating = 0;
  starCount = 5;
  color: ThemePalette = 'accent';
  ratingArr = [];
  CreationForm: FormGroup ;
  language: IResumeLanguageModel;

  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
  ) {
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
    this.CreationForm = this.fb.group({
      resume_language_code: '',
      resume_code : Math.random().toString(),
      level : this.rating,
    });
  }
  /**
   * @description Create Language
   */
  createLanguage() {
    this.language = this.CreationForm.value;
    this.language.level = this.rating.toString();
    console.log('rating', this.rating);
    if (this.CreationForm.valid) {
      console.log(this.CreationForm.value);
      this.resumeService.addLanguage(this.language).subscribe(data => console.log('Language=', data));

    } else { console.log('Form is not valid');
    }
  }

}

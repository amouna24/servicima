import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { IResumeProfessionalExperienceModel } from '@shared/models/resumeProfessionalExperience.model';

@Component({
  selector: 'wid-pro-exp',
  templateUrl: './pro-exp.component.html',
  styleUrls: ['./pro-exp.component.scss']
})
export class ProExpComponent implements OnInit {
  sendProExp: FormGroup;
  arrayProExpCount = 0;
  ProExp: IResumeProfessionalExperienceModel;
  get inputFields() {
    return this.sendProExp.get('Field') as FormArray;
  }
  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  /**
   * @description Create Form
   */
  createForm() {
    this.sendProExp = this.fb.group({
      Field: this.fb.array([this.fb.group({
        professional_experience_code: '',
        position: '',
      customer : '',
      resume_code : '',
      start_date: '',
      end_date: '',
      index: '',
      })])});
  }
  /**
   * @description Create Technical skill
   */
  createProExp() {
    this.ProExp = this.sendProExp.controls.Field.value;
    this.ProExp[this.arrayProExpCount].resume_code = Math.random();
    this.ProExp[this.arrayProExpCount].professional_experience_code = Math.random();
    this.ProExp[this.arrayProExpCount].index = this.arrayProExpCount;
    if (this.sendProExp.controls.Field.valid) {
      console.log('ProExp input= ', this.ProExp[this.arrayProExpCount]);
      this.resumeService.addProExp(this.ProExp[this.arrayProExpCount]).subscribe(data => console.log('Professional experience =', data));
      this.inputFields.push(this.fb.group({
        professional_experience_code: '',
        position: '',
        customer : '',
        resume_code : '',
        start_date: '',
        end_date: '',
        index: '', }));
    } else { console.log('Form is not valid');
    }
    this.arrayProExpCount++;

  }
}

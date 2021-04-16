import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { IResumeFunctionalSkillsModel } from '@shared/models/resumeFunctionalSkills.model';

@Component({
  selector: 'wid-resume-func-skill',
  templateUrl: './resume-func-skill.component.html',
  styleUrls: ['./resume-func-skill.component.scss']
})
export class ResumeFuncSkillComponent implements OnInit {
  sendFuncSkill: FormGroup;
  arrayFuncSkillCount = 0;
  FuncSkill: IResumeFunctionalSkillsModel;
  get inputFields() {
    return this.sendFuncSkill.get('Field') as FormArray;
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
    this.sendFuncSkill = this.fb.group({
      Field: this.fb.array([this.fb.group({
        functional_skills_code: Math.random(),
      resume_code : Math.random(),
      skill : '',
      index: this.arrayFuncSkillCount,
      })])});
  }
  /**
   * @description Create Technical skill
   */
  createFunctionalSkill() {
    this.FuncSkill = this.sendFuncSkill.controls.Field.value;
    this.FuncSkill[this.arrayFuncSkillCount].resume_code = Math.random();
    this.FuncSkill[this.arrayFuncSkillCount].functional_skills_code = Math.random();
    this.FuncSkill[this.arrayFuncSkillCount].index = this.arrayFuncSkillCount;

    console.log(this.FuncSkill[this.arrayFuncSkillCount]);
    if (this.sendFuncSkill.controls.Field.valid) {
      console.log('Functional skills table ', this.sendFuncSkill.controls.Field.value);
      this.resumeService.addFunctionalSkills(this.FuncSkill[this.arrayFuncSkillCount]).subscribe(data => console.log('functional skill =', data));
      this.inputFields.push(this.fb.group({
        functional_skills_code: Math.random(),
        resume_code : Math.random(),
        skill : '',
        index: this.arrayFuncSkillCount, }));
    } else { console.log('Form is not valid');
    }
    this.arrayFuncSkillCount++;

  }
}

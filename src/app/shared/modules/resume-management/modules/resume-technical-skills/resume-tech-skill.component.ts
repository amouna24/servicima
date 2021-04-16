import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { IResumeTechnicalSkillsModel } from '@shared/models/resumeTechnicalSkills.model';

@Component({
  selector: 'wid-resume-tech-skill',
  templateUrl: './resume-tech-skill.component.html',
  styleUrls: ['./resume-tech-skill.component.scss']
})
export class ResumeTechSkillComponent implements OnInit {
  sendTechSkill: FormGroup;
  arrayTechSkillCount = 0;
  TechSkill: IResumeTechnicalSkillsModel;
  get inputFields() {
    return this.sendTechSkill.get('Field') as FormArray;
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
    this.sendTechSkill = this.fb.group({
      Field: this.fb.array([this.fb.group({
      technical_skill_code: Math.random(),
      resume_code : 'a',
      technical_skill_desc : '',
      technologies: '',
      skill_index: '',
      })])});
  }
  /**
   * @description Create Technical skill
   */
  createTechnicalSkill() {
    this.TechSkill = this.sendTechSkill.controls.Field.value;
    this.TechSkill[this.arrayTechSkillCount].resume_code = Math.random();
    this.TechSkill[this.arrayTechSkillCount].technical_skill_code = Math.random();
    this.TechSkill[this.arrayTechSkillCount].skill_index = this.arrayTechSkillCount;
    if (this.sendTechSkill.controls.Field.valid) {
      console.log('technical skill input= ', this.TechSkill[this.arrayTechSkillCount]);
      this.resumeService.addTechnicalSkills(this.TechSkill[this.arrayTechSkillCount]).subscribe(data => console.log('Technical skill =', data));
      this.inputFields.push(this.fb.group({
        technical_skill_code: Math.random(),
        resume_code : 'a',
        technical_skill_desc : '',
        technologies: '',
        skill_index: '0', }));
    } else { console.log('Form is not valid');
    }
    this.arrayTechSkillCount++;

  }
}

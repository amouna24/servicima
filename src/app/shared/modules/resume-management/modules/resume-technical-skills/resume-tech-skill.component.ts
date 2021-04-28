import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { IResumeTechnicalSkillsModel } from '@shared/models/resumeTechnicalSkills.model';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '@core/services/user/user.service';

@Component({
  selector: 'wid-resume-tech-skill',
  templateUrl: './resume-tech-skill.component.html',
  styleUrls: ['./resume-tech-skill.component.scss']
})
export class ResumeTechSkillComponent implements OnInit {
  sendTechSkill: FormGroup;
  arrayTechSkillCount = 0;
  TechSkill: IResumeTechnicalSkillsModel;
  techSkillArray: IResumeTechnicalSkillsModel[] = [];
  resume_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-TECH`;
  technical_skill: string;
  get getTech() {
    return this.techSkillArray;
  }
  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private userService: UserService,
  ) { }

  getTechnicalSkillsInfo() {
    this.resumeService.getResume(
      // tslint:disable-next-line:max-line-length
      `?email_address=${this.userService.connectedUser$.getValue().user[0]['userKey']['email_address']}&company_email=${this.userService.connectedUser$.getValue().user[0]['company_email']}`)
      .subscribe(
        (response) => {
          this.resume_code = response[0].ResumeKey.resume_code.toString();
          console.log('resume code 1 =', this.resume_code);
          this.resumeService.getTechnicalSkills(
            `?resume_code=${this.resume_code}`)
            .subscribe(
              (responseOne) => {
                console.log('response', responseOne);
                this.techSkillArray = responseOne;
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

  ngOnInit(): void {
    this.getTechnicalSkillsInfo();
    this.createForm();
  }

  /**
   * @description Create Form
   */
  createForm() {
    this.sendTechSkill = this.fb.group({
      technical_skill_desc : '',
      technologies: '',
      });
  }
  /**
   * @description Create Technical skill
   */
  createTechnicalSkill() {
    this.TechSkill = this.sendTechSkill.value;
    this.TechSkill.resume_code = this.resume_code;
    this.TechSkill.technical_skill_code = Math.random().toString();
    this.TechSkill.skill_index = this.arrayTechSkillCount.toString();
    if (this.sendTechSkill.valid) {
      console.log('technical skill input= ', this.TechSkill);
      this.resumeService.addTechnicalSkills(this.TechSkill).subscribe(data => console.log('Technical skill =', data));
      this.getTech.push(this.TechSkill);
    } else { console.log('Form is not valid');
    }
    this.sendTechSkill.reset();
    this.arrayTechSkillCount++;

  }
  isControlHasError(form: FormGroup, controlName: string, validationType: string): boolean {
    const control = form[controlName];
    if (!control) {
      return true;
    }
    return control.hasError(validationType) ;
  }
}

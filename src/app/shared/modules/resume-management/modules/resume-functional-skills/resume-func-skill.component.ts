import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { IResumeFunctionalSkillsModel } from '@shared/models/resumeFunctionalSkills.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { UserService } from '@core/services/user/user.service';

@Component({
  selector: 'wid-resume-func-skill',
  templateUrl: './resume-func-skill.component.html',
  styleUrls: ['./resume-func-skill.component.scss']
})
export class ResumeFuncSkillComponent implements OnInit {
  sendFuncSkill: FormGroup;
  arrayFuncSkillCount = 0;
  FuncSkill: IResumeFunctionalSkillsModel;
  funcSkillArray: IResumeFunctionalSkillsModel[] = [];
  resume_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-FUNC`;
  get getFunc() {
    return this.funcSkillArray;
  }
  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getFuncSkillsInfo();
  }
  getFuncSkillsInfo() {
    this.resumeService.getResume(
      // tslint:disable-next-line:max-line-length
      `?email_address=${this.userService.connectedUser$.getValue().user[0]['userKey']['email_address']}&company_email=${this.userService.connectedUser$.getValue().user[0]['company_email']}`)
      .subscribe(
        (response) => {
          this.resume_code = response[0].ResumeKey.resume_code.toString();
          console.log('resume code 1 =', this.resume_code);
          this.resumeService.getFunctionalSkills(
            `?resume_code=${this.resume_code}`)
            .subscribe(
              (responseOne) => {
                console.log('response', responseOne);
                this.funcSkillArray = responseOne;
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

  /**
   * @description Create Form
   */
  createForm() {
    this.sendFuncSkill = this.fb.group({
      skill : '',
      });
  }
  /**
   * @description Create Technical skill
   */
  createFunctionalSkill() {
    this.FuncSkill = this.sendFuncSkill.value;
    this.FuncSkill.resume_code = this.resume_code;
    this.FuncSkill.functional_skills_code = Math.random().toString();
    this.FuncSkill.index = this.arrayFuncSkillCount;
    console.log('model=', this.FuncSkill);
    if (this.sendFuncSkill.valid) {
      this.resumeService.addFunctionalSkills(this.FuncSkill).subscribe(data => console.log('functional skill =', data));
      this.getFunc.push(this.FuncSkill);
    } else { console.log('Form is not valid');
    }
    this.sendFuncSkill.reset();
    this.arrayFuncSkillCount++;

  }
}

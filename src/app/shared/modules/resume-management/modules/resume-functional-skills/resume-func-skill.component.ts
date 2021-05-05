import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { IResumeFunctionalSkillsModel } from '@shared/models/resumeFunctionalSkills.model';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { UserService } from '@core/services/user/user.service';
import { logger } from 'codelyzer/util/logger';
import { ModalService } from '@core/services/modal/modal.service';

@Component({
  selector: 'wid-resume-func-skill',
  templateUrl: './resume-func-skill.component.html',
  styleUrls: ['./resume-func-skill.component.scss']
})
export class ResumeFuncSkillComponent implements OnInit {
  sendFuncSkill: FormGroup;
  arrayFuncSkillCount = 0;
  FuncSkill: IResumeFunctionalSkillsModel;
  FuncSkillUpdate: IResumeFunctionalSkillsModel;
  funcSkillArray: IResumeFunctionalSkillsModel[] = [];
  resume_code = '';
  button = 'Add';
  functional_skill_code = '';
  indexUpdate = 0;
  _id = '';
  subscriptionModal: Subscription;
  get getFunc() {
    return this.funcSkillArray;
  }
  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private userService: UserService,
    private modalServices: ModalService,
  ) { }

  ngOnInit(): void {
    this.getFuncSkillsInfo();
    this.createForm();
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
                if (responseOne['msg_code'] !== '0004') {
                  console.log('response', responseOne);
                  this.funcSkillArray = responseOne;
                  this.arrayFuncSkillCount = responseOne.length;
                  this.funcSkillArray.forEach(
                    (func) => {
                      func.functional_skills_code = func.ResumeFunctionalSkillsKey.functional_skills_code;
                    }
                  );
                }
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

  deleteFuncSkill(_id: string, pointIndex: number) {
    const confirmation = {
      code: 'delete',
      title: 'Are you sure ?',
    };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .subscribe(
        (res) => {
          if (res === true) {
            this.resumeService.deleteFunctionalSkills(_id).subscribe(data => console.log('Deleted'));
            this.funcSkillArray.forEach((value, index) => {
              if (index === pointIndex) { this.funcSkillArray.splice(index, 1); }
            });
            this.button = 'Add';
            this.subscriptionModal.unsubscribe();
          }
        }
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
   * @description Create Functional skill
   */
 async createUpdateFunctionalSkill() {
    if (this.button === 'Add') {
    this.FuncSkill = this.sendFuncSkill.value;
    this.FuncSkill.resume_code = this.resume_code;
    this.FuncSkill.functional_skills_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-FUNC`;
    this.FuncSkill.index = this.arrayFuncSkillCount;
    console.log('model=', this.FuncSkill);
    if (this.sendFuncSkill.valid) {
     await this.resumeService.addFunctionalSkills(this.FuncSkill).subscribe(data => {
        console.log('functional skill =', data);
       this.getFuncSkillsInfo();
     });
this.arrayFuncSkillCount++;
    } else { console.log('Form is not valid');
    }} else {
      this.FuncSkillUpdate = this.sendFuncSkill.value;
      this.FuncSkillUpdate.functional_skills_code = this.functional_skill_code;
      this.FuncSkillUpdate.resume_code = this.resume_code;
      this.FuncSkillUpdate.index = this.indexUpdate;
      this.FuncSkillUpdate._id = this._id;
      this.resumeService.updateFunctionalSkills(this.FuncSkillUpdate).subscribe(data => console.log('functional skill updated =', data));
      this.funcSkillArray[this.indexUpdate] = this.FuncSkillUpdate;
      this.button = 'Add';
    }
    this.sendFuncSkill.reset();
  }
  isControlHasError(form: FormGroup, controlName: string, validationType: string): boolean {
    const control = form[controlName];
    if (!control) {
      return true;
    }
    return control.hasError(validationType) ;
  }

  editForm(_id: string, functional_skills_code: string, skill: string , index: number) {
    this.sendFuncSkill.patchValue({
      skill,
    });
    this._id = _id;
    this.functional_skill_code = functional_skills_code;
    this.indexUpdate = index;
    this.button = 'Save';
/*
*/
    console.log('FuncSkill update', this.FuncSkillUpdate);
  }
  testRequired() {
    return (this.sendFuncSkill.invalid) ;
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { IResumeFunctionalSkillsModel } from '@shared/models/resumeFunctionalSkills.model';
import { Subscription } from 'rxjs';
import { UserService } from '@core/services/user/user.service';
import { ModalService } from '@core/services/modal/modal.service';
import { NavigationEnd, Router, Event } from '@angular/router';

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
  funcSkillArray: IResumeFunctionalSkillsModel[];
  resume_code: string;
  button: string;
  functional_skill_code: string;
  indexUpdate = 0;
  _id: string;
  subscriptionModal: Subscription;
  showNumberError: boolean;
  /**********************************************************************
   * @description Resume Functional skills constructor
   *********************************************************************/
  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private userService: UserService,
    private modalServices: ModalService,
    private router: Router,
  ) { }
  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  ngOnInit(): void {
    this.button = 'Add';
    this.showNumberError = false;
    this.funcSkillArray = [];
    this.getFuncSkillsInfo();
    this.createForm();
    }
  /**************************************************************************
   * @description Get Functional skills data from Resume Service
   *************************************************************************/
  getFuncSkillsInfo() {
    this.resumeService.getResume(
      // tslint:disable-next-line:max-line-length
      `?email_address=${this.userService.connectedUser$.getValue().user[0]['userKey']['email_address']}&company_email=${this.userService.connectedUser$.getValue().user[0]['company_email']}`)
      .subscribe(
        (response) => {
          if (response['msg_code'] !== '0004') {
            this.resume_code = response[0].ResumeKey.resume_code.toString();
          this.resumeService.getFunctionalSkills(
            `?resume_code=${this.resume_code}`)
            .subscribe(
              (responseOne) => {
                if (responseOne['msg_code'] !== '0004') {
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
            ); } else {
            this.router.navigate(['/candidate/resume/']);
          }},
        (error) => {
          if (error.error.msg_code === '0004') {
          }
        },
      );

  }
  /**************************************************************************
   * @description Delete Seleceted Functional Skilll
   *************************************************************************/
  deleteFuncSkill(_id: string, pointIndex: number) {
    const confirmation = {
      code: 'delete',
      title: 'Delete This Functionnal Skills ?',
      description: 'Are you sure ?',
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
          }
          this.subscriptionModal.unsubscribe();
        }
      );
  }
  /**************************************************************************
   * @description Initialize the Functionnal skill form
   *************************************************************************/
  createForm() {
    this.sendFuncSkill = this.fb.group({
      skill :  ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      });
  }
  /**************************************************************************
   * @description Create or Update Functional skill
   *************************************************************************/
  async createUpdateFunctionalSkill() {
    if (this.button === 'Add') {
    this.FuncSkill = this.sendFuncSkill.value;
    this.FuncSkill.resume_code = this.resume_code;
    this.FuncSkill.functional_skills_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-FUNC`;
    this.FuncSkill.index = this.arrayFuncSkillCount;
    if (this.sendFuncSkill.valid ) {
     await this.resumeService.addFunctionalSkills(this.FuncSkill).subscribe(data => {
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
      if (this.sendFuncSkill.valid && !this.showNumberError) {
      this.resumeService.updateFunctionalSkills(this.FuncSkillUpdate).subscribe(data => console.log('functional skill updated =', data));
      this.funcSkillArray[this.indexUpdate] = this.FuncSkillUpdate;
      this.button = 'Add'; }
    }
    this.sendFuncSkill.reset();
    this.showNumberError = false;
  }
  /**************************************************************************
   * @description get data from a selected Custom section and set it in the current form
   *************************************************************************/
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
  }
}

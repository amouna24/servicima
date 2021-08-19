import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { IResumeFunctionalSkillsModel } from '@shared/models/resumeFunctionalSkills.model';
import { Subscription } from 'rxjs';
import { UserService } from '@core/services/user/user.service';
import { ModalService } from '@core/services/modal/modal.service';
import { Router } from '@angular/router';
import { blueToGrey, downLine, GreyToBlue, showBloc, showProExp } from '@shared/animations/animations';

@Component({
  selector: 'wid-resume-func-skill',
  templateUrl: './resume-func-skill.component.html',
  styleUrls: ['./resume-func-skill.component.scss'],
  animations: [
    blueToGrey,
    GreyToBlue,
    downLine,
    showBloc,
    showProExp,

  ]
})
export class ResumeFuncSkillComponent implements OnInit {
  sendFuncSkill: FormGroup;
  arrayFuncSkillCount = 0;
  FuncSkill: IResumeFunctionalSkillsModel;
  FuncSkillUpdate: IResumeFunctionalSkillsModel;
  funcSkillArray: IResumeFunctionalSkillsModel[];
  resumeCode: string;
  button: string;
  functionalSkillCode: string;
  indexUpdate = 0;
  id: string;
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
  ) {
    this.resumeCode = this.router.getCurrentNavigation()?.extras?.state?.resumeCode;
  }

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
    if (this.resumeCode) {
      this.resumeService.getFunctionalSkills(
        `?resume_code=${this.resumeCode}`)
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
        );
    } else if (this.userService.connectedUser$.getValue().user[0].user_type === 'COMPANY' && !this.resumeCode) {
      this.router.navigate(['manager/resume/']);
    } else if (this.userService.connectedUser$.getValue().user[0].user_type === 'CANDIDATE') {
      this.resumeService.getResume(
        `?email_address=${this.userService.connectedUser$
          .getValue().user[0]['userKey']['email_address']}&company_email=${this.userService.connectedUser$
          .getValue().user[0]['company_email']}`).subscribe(
        (response) => {
          if (response['msg_code'] !== '0004') {
            this.resumeCode = response[0].ResumeKey.resume_code.toString();
            this.resumeService.getFunctionalSkills(
              `?resume_code=${this.resumeCode}`)
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
              );
          } else {
            this.router.navigate(['/candidate/resume/']);
          }
        },
        (error) => {
          if (error.error.msg_code === '0004') {
          }
        },
      );
    }
  }

  /**************************************************************************
   * @description Delete Selected Functional Skilll
   * @param id the id of the deleted functionnal skill
   * @param pointIndex the index of the deleted functional skill
   *************************************************************************/
  deleteFuncSkill(id: string, pointIndex: number) {
    const confirmation = {
      code: 'delete',
      title: 'resume-delete-func',
      description: 'resume-u-sure',
    };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .subscribe(
        (res) => {
          if (res === true) {
            this.resumeService.deleteFunctionalSkills(id).subscribe(data => console.log('Deleted'));
            this.funcSkillArray.forEach((value, index) => {
              if (index === pointIndex) {
                this.funcSkillArray.splice(index, 1);
              }
            });
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
      skill: ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
    });
  }

  /**************************************************************************
   * @description Create or Update Functional skill
   *************************************************************************/
  async createUpdateFunctionalSkill() {
    if (this.button === 'Add') {
      this.FuncSkill = this.sendFuncSkill.value;
      this.FuncSkill.resume_code = this.resumeCode;
      this.FuncSkill.functional_skills_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-FUNC`;
      this.FuncSkill.index = this.arrayFuncSkillCount;
      if (this.sendFuncSkill.valid) {
        await this.resumeService.addFunctionalSkills(this.FuncSkill).subscribe(data => {
          this.resumeService.getFunctionalSkills(
            `?functional_skills_code=${this.FuncSkill.functional_skills_code}`)
            .subscribe(
              (responseOne) => {
                if (responseOne['msg_code'] !== '0004') {
                  this.funcSkillArray.push(responseOne[0]);
                }});
          this.arrayFuncSkillCount++;
        });
      } else {
        console.log('Form is not valid');
      }
    } else {
      this.FuncSkillUpdate = this.sendFuncSkill.value;
      this.FuncSkillUpdate.functional_skills_code = this.functionalSkillCode;
      this.FuncSkillUpdate.resume_code = this.resumeCode;
      this.FuncSkillUpdate.index = this.indexUpdate;
      this.FuncSkillUpdate._id = this.id;
      if (this.sendFuncSkill.valid && !this.showNumberError) {
        this.resumeService.updateFunctionalSkills(this.FuncSkillUpdate).subscribe(data => {
          console.log('functional skill updated =', data);
          this.funcSkillArray.splice( this.indexUpdate, 0, data);
        });
        this.button = 'Add';
      }
    }
    this.sendFuncSkill.reset();
    this.showNumberError = false;
  }

  /**************************************************************************
   * @description get data from a selected functional skills and set it in the current form
   * @param functionalSkill the Functional Skill model
   * @param index the index of the selected Functional skill
   *************************************************************************/
  editForm(functionalSkill: IResumeFunctionalSkillsModel, index: number) {
    this.sendFuncSkill.patchValue({
      skill: functionalSkill.skill,
    });
    this.funcSkillArray.splice( index, 1);
    this.id = functionalSkill._id;
    this.functionalSkillCode = functionalSkill.ResumeFunctionalSkillsKey.functional_skills_code;
    this.indexUpdate = index;
    this.button = 'Save';
  }
  /**************************************************************************
   * @description add indexation
   *************************************************************************/
  addIndexation() {
    const indexationArray = [];
    for (let i = 1; i < 10; i++) {
      indexationArray[i] = '0' + i.toString();
    }
    return(indexationArray);
  }
  /**************************************************************************
   * @description Route to next page or to the previous page
   * @param typeRoute type of route previous or next
   *************************************************************************/
  routeNextBack(typeRoute: string) {
    if (this.userService.connectedUser$.getValue().user[0].user_type === 'COMPANY') {
      if (typeRoute === 'next') {
        this.router.navigate(['/manager/resume/intervention'], {
          state: {
            resumeCode: this.resumeCode
          }
        });
      } else {
        this.router.navigate(['/manager/resume/technicalSkills'], {
          state: {
            resumeCode: this.resumeCode
          }
        });
      }
    } else {
      if (typeRoute === 'next') {
        this.router.navigate(['/candidate/resume/intervention'], {
          state: {
            resumeCode: this.resumeCode
          }
        });
      } else {
        this.router.navigate(['/candidate/resume/technicalSkills'], {
          state: {
            resumeCode: this.resumeCode
          }
        });
      }
    }

  }

}

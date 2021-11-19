import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { IResumeTechnicalSkillsModel } from '@shared/models/resumeTechnicalSkills.model';
import { blueToGrey, downLine, GreyToBlue, showBloc, dataAppearance } from '@shared/animations/animations';
import { UserService } from '@core/services/user/user.service';
import { Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'wid-resume-tech-skill',
  templateUrl: './resume-tech-skill.component.html',
  styleUrls: ['./resume-tech-skill.component.scss'],
  animations: [
    blueToGrey,
    GreyToBlue,
    downLine,
    showBloc,
    dataAppearance
  ]
})
export class ResumeTechSkillComponent implements OnInit {
  sendTechSkill: FormGroup;
  arrayTechSkillCount = 0;
  TechSkill: IResumeTechnicalSkillsModel;
  techSkillArray: IResumeTechnicalSkillsModel[];
  techSkillUpdate: IResumeTechnicalSkillsModel;
  resumeCode: string;
  technicalSkillCode: string ;
  indexUpdate = 0;
  button: string;
  id: string;
  subscriptionModal: Subscription;
  showNumberError: boolean;
  skillIndex: string;
  companyUserType: string;
  /**********************************************************************
   * @description Resume Technical skills constructor
   *********************************************************************/
  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private userService: UserService,
    private modalServices: ModalService,
    private router: Router,
  ) {
    this.resumeCode = this.router.getCurrentNavigation()?.extras?.state?.resumeCode;
    this.companyUserType = this.router.getCurrentNavigation()?.extras?.state?.companyUserType;
  }
  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  ngOnInit(): void {
    this.showNumberError = false;
    this.button = 'Add';
    this.techSkillArray = [];
    this.getTechnicalSkillsInfo();
    this.createForm();
  }
  /**************************************************************************
   * @description Get Technical Skill Data from Resume Service
   *************************************************************************/
  getTechnicalSkillsInfo() {
    if (this.resumeCode) {
      this.resumeService.getTechnicalSkills(
        `?resume_code=${this.resumeCode}`)
        .subscribe(
          (responseOne) => {
            if (responseOne['msg_code'] !== '0004') {
              this.techSkillArray = responseOne;
              this.arrayTechSkillCount = responseOne.length;
              this.techSkillArray.forEach(
                (tech) => {
                  tech.technical_skill_code = tech.ResumeTechnicalSkillsKey.technical_skill_code;
                }
              );
            }},
          (error) => {
            if (error.error.msg_code === '0004') {
            }
          },
        );
    } else if (this.userService.connectedUser$.getValue().user[0].user_type === 'COMPANY' && !this.resumeCode) {
      this.router.navigate(['manager/resume/']);
    } else if (this.userService.connectedUser$.getValue().user[0].user_type === 'CANDIDATE' ||
      this.userService.connectedUser$.getValue().user[0].user_type === 'COLLABORATOR') {    this.resumeService.getResume(
      `?email_address=${this.userService.connectedUser$
        .getValue().user[0]['userKey']['email_address']}&company_email=${this.userService.connectedUser$
        .getValue().user[0]['company_email']}`).subscribe((response) => {
          if (response['msg_code'] !== '0004') {
            this.resumeCode = response[0].ResumeKey.resume_code.toString();
          this.resumeService.getTechnicalSkills(
            `?resume_code=${this.resumeCode}`)
            .subscribe(
              (responseOne) => {
                if (responseOne['msg_code'] !== '0004') {
                  this.techSkillArray = responseOne;
                  this.arrayTechSkillCount = responseOne.length;
                  this.techSkillArray.forEach(
                    (tech) => {
                      tech.technical_skill_code = tech.ResumeTechnicalSkillsKey.technical_skill_code;
                    }
                  );
                }},
              (error) => {
                if (error.error.msg_code === '0004') {
                }
              },
            );
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
   * @description Inisialize technical technical Form
   *************************************************************************/
  createForm() {
    this.sendTechSkill = this.fb.group({
      technical_skill_desc :  ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      technologies:  ['', [Validators.required]],
      });
  }
  /**************************************************************************
   * @description Create or Update a Technical skill
   * *************************************************************************/
  createUpdateTechnicalSkill() {
    if (this.button === 'Add') {
    this.TechSkill = this.sendTechSkill.value;
    this.TechSkill.resume_code = this.resumeCode;
    this.TechSkill.technical_skill_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-TECH`;
    this.TechSkill.skill_index = this.arrayTechSkillCount.toString();
    if (this.sendTechSkill.valid ) {
      this.resumeService.addTechnicalSkills(this.TechSkill).subscribe(data => {
        this.resumeService.getTechnicalSkills(
          `?technical_skill_code=${this.TechSkill.technical_skill_code}`)
          .subscribe(
            (responseOne) => {
              if (responseOne['msg_code'] !== '0004') {
                this.techSkillArray.push(responseOne[0]);
                   }});
        this.arrayTechSkillCount++;
    }); }
  } else {
      this.techSkillUpdate = this.sendTechSkill.value;
      this.techSkillUpdate.technical_skill_code = this.technicalSkillCode;
      this.techSkillUpdate.resume_code = this.resumeCode;
      this.techSkillUpdate.skill_index = this.skillIndex;
      this.techSkillUpdate._id = this.id;
      if (this.sendTechSkill.valid) {
        this.resumeService.updateTechnicalSkills(this.techSkillUpdate).subscribe(data => {
          this.techSkillArray.splice(this.indexUpdate, 0,  data);
          console.log('Technical skill updated =', data);
        });
this.button = 'Add'; }
    }
    this.sendTechSkill.reset();
    this.showNumberError = false;
  }
  /**************************************************************************
   * @description Set data of a selected Custom section and set it in the current form
   * @param techSkill the Technical Skill model
   * @param pointIndex the index of the selected technical skill
   *************************************************************************/
  editForm(techSkill: IResumeTechnicalSkillsModel, pointIndex: number) {
    this.sendTechSkill.patchValue({
      technical_skill_desc: techSkill.technical_skill_desc,
      technologies: techSkill.technologies,
    });
    this.techSkillArray.splice(pointIndex, 1);
    this.technicalSkillCode = techSkill.ResumeTechnicalSkillsKey.technical_skill_code;
    this.id = techSkill._id;
    this.skillIndex = techSkill.ResumeTechnicalSkillsKey.skill_index;
    this.indexUpdate = pointIndex;
    this.button = 'Save';
  }
  /**************************************************************************
   * @description Delete the selected Custom section
   * @param id the id of the deleted technical skill
   * @param pointIndex the index of the deleted technical skill
   *************************************************************************/
  deleteTechSkill(id: string, pointIndex: number) {
    const confirmation = {
      code: 'delete',
      title: 'resume-delete-tech',
      description: 'resume-u-sure',
    };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .subscribe(
        (res) => {
          if (res === true) {
            this.resumeService.deleteTechnicalSkills(id).subscribe(data => console.log('Deleted'));
            this.techSkillArray.forEach((value, index) => {
              if (index === pointIndex) { this.techSkillArray.splice(index, 1); }
            });
          }
          this.arrayTechSkillCount--;
          this.subscriptionModal.unsubscribe();
        }
  );

  }
  /**************************************************************************
   * @description Show indexation
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
        this.router.navigate(['/manager/resume/functionnalSkills'], {
          state: {
            resumeCode: this.resumeCode,
            companyUserType: this.companyUserType,
          }
        });
      } else {
        this.router.navigate(['/manager/resume/certifications'], {
          state: {
            resumeCode: this.resumeCode,
            companyUserType: this.companyUserType,
          }
        });
      }
    } else if (this.userService.connectedUser$.getValue().user[0].user_type === 'CANDIDATE') {
      if (typeRoute === 'next') {
          this.router.navigate(['/candidate/resume/functionalSkills'], {
            state: {
              resumeCode: this.resumeCode
            }
          });
        } else {
          this.router.navigate(['/candidate/resume/certifications'], {
            state: {
              resumeCode: this.resumeCode
            }
          });
        }
    } else {
      if (typeRoute === 'next') {
        this.router.navigate(['/collaborator/resume/functionalSkills'], {
          state: {
            resumeCode: this.resumeCode
          }
        });
      } else {
        this.router.navigate(['/collaborator/resume/certifications'], {
          state: {
            resumeCode: this.resumeCode
          }
        });
      }
    }
  }
  checkFormValues(typeRoute: string) {
    let notEmptyForm = false;
    Object.values(this.sendTechSkill.controls).some(({ value }) => {
      if (value) {
        notEmptyForm = true;
      }
    });
    if (!notEmptyForm) {
      this.routeNextBack(typeRoute);
    } else {
      const confirmation = {
        code: 'confirmation',
        title: 'Data is not saved',
        description: `Are you sure you want go to the  ${typeRoute} page ?`,
      };
      this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
        .subscribe(
          (res) => {
            if (res === true) {
              this.routeNextBack(typeRoute);
            }
            this.subscriptionModal.unsubscribe();
          }
        );
    }
  }

}

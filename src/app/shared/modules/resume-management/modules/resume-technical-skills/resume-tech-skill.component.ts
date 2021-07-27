import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { IResumeTechnicalSkillsModel } from '@shared/models/resumeTechnicalSkills.model';
import { UserService } from '@core/services/user/user.service';
import { Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'wid-resume-tech-skill',
  templateUrl: './resume-tech-skill.component.html',
  styleUrls: ['./resume-tech-skill.component.scss']
})
export class ResumeTechSkillComponent implements OnInit {
  sendTechSkill: FormGroup;
  arrayTechSkillCount = 0;
  TechSkill: IResumeTechnicalSkillsModel;
  techSkillArray: IResumeTechnicalSkillsModel[];
  techSkillUpdate: IResumeTechnicalSkillsModel;
  resume_code: string;
  technical_skill_code: string ;
  indexUpdate = 0;
  button: string;
  _id: string;
  subscriptionModal: Subscription;
  showNumberError: boolean;
  /**********************************************************************
   * @description Resume Technical skills constructor
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
    this.resumeService.getResume(
      // tslint:disable-next-line:max-line-length
      `?email_address=${this.userService.connectedUser$.getValue().user[0]['userKey']['email_address']}&company_email=${this.userService.connectedUser$.getValue().user[0]['company_email']}`)
      .subscribe(
        (response) => {
          if (response['msg_code'] !== '0004') {
            this.resume_code = response[0].ResumeKey.resume_code.toString();
          this.resumeService.getTechnicalSkills(
            `?resume_code=${this.resume_code}`)
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
        } else {
      this.router.navigate(['/candidate/resume/']);
    }},
        (error) => {
          if (error.error.msg_code === '0004') {
          }
        },
      );
  }

  /**************************************************************************
   * @description Inisialize technical technical Form
   *************************************************************************/
  createForm() {
    this.sendTechSkill = this.fb.group({
      technical_skill_desc :  ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      technologies:  ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      });
  }
  /**************************************************************************
   * @description Create or Update a Technical skill
   * *************************************************************************/
  createUpdateTechnicalSkill() {
    if (this.button === 'Add') {
    this.TechSkill = this.sendTechSkill.value;
    this.TechSkill.resume_code = this.resume_code;
    this.TechSkill.technical_skill_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-TECH`;
    this.TechSkill.skill_index = this.arrayTechSkillCount.toString();
    if (this.sendTechSkill.valid ) {
      this.resumeService.addTechnicalSkills(this.TechSkill).subscribe(data => {
        this.getTechnicalSkillsInfo();
      });
    }
    this.arrayTechSkillCount++; } else {
      this.techSkillUpdate = this.sendTechSkill.value;
      this.techSkillUpdate.technical_skill_code = this.technical_skill_code;
      this.techSkillUpdate.resume_code = this.resume_code;
      this.techSkillUpdate.skill_index = this.indexUpdate.toString();
      this.techSkillUpdate._id = this._id;
      if (this.sendTechSkill.valid && this.showNumberError === false) {
        this.resumeService.updateTechnicalSkills(this.techSkillUpdate).subscribe(data => console.log('Technical skill updated =', data));
      this.techSkillArray[this.indexUpdate] = this.techSkillUpdate;
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
    this.technical_skill_code = techSkill.ResumeTechnicalSkillsKey.technical_skill_code;
    this._id = techSkill._id;
    this.indexUpdate = pointIndex;
    this.button = 'Save';
    /*
    */
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
            this.button = 'Add';
          }
          this.arrayTechSkillCount--;
          this.subscriptionModal.unsubscribe();
        }
  );

  }

}

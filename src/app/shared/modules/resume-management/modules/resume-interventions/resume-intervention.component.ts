import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { IResumeInterventionModel } from '@shared/models/resumeIntervention.model';
import { UserService } from '@core/services/user/user.service';
import { Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';
import { Router } from '@angular/router';
import { blueToGrey, downLine, GreyToBlue, showBloc, showProExp } from '@shared/animations/animations';

@Component({
  selector: 'wid-resume-intervention',
  templateUrl: './resume-intervention.component.html',
  styleUrls: ['./resume-intervention.component.scss'],
  animations: [
    blueToGrey,
    GreyToBlue,
    downLine,
    showBloc,
    showProExp,
  ]
})
export class ResumeInterventionComponent implements OnInit {
  sendIntervention: FormGroup;
  arrayInterventionCount = 0;
  Intervention: IResumeInterventionModel;
  interventionArray: IResumeInterventionModel[];
  resumeCode: string;
  interventionUpdate: IResumeInterventionModel;
  intervention_code: string;
  button: string;
  indexUpdate = 0;
  id: string;
  subscriptionModal: Subscription;
  showNumberError: boolean;

  /**********************************************************************
   * @description Resume Level of intervention constructor
   *********************************************************************/
  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private userService: UserService,
    private modalServices: ModalService,
    private router: Router,
  ) {
  }

  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  ngOnInit(): void {
    this.interventionArray = [];
    this.button = 'Add';
    this.showNumberError = false;
    this.getInterventionInfo();
    this.createForm();
  }

  /**************************************************************************
   * @description Get Intervention Data from Resume Service
   *************************************************************************/
  getInterventionInfo() {
    this.resumeService.getResume(
      `?email_address=${this.userService.connectedUser$
        .getValue().user[0]['userKey']['email_address']}&company_email=${this.userService.connectedUser$
        .getValue().user[0]['company_email']}`).subscribe((response) => {
        if (response['msg_code'] !== '0004') {
          this.resumeCode = response[0].ResumeKey.resume_code.toString();
          this.resumeService.getIntervention(
            `?resume_code=${this.resumeCode}`)
            .subscribe(
              (responseOne) => {
                if (responseOne['msg_code'] !== '0004') {
                  this.interventionArray = responseOne;
                  this.interventionArray.forEach(
                    (func) => {
                      func.intervention_code = func.ResumeInterventionKey.intervention_code;
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

  /**************************************************************************
   * @description Initialization of the Intervention Form
   *************************************************************************/
  createForm() {
    this.sendIntervention = this.fb.group({
      level_of_intervention_desc: ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
    });
  }

  /**************************************************************************
   * @description Create or Update Level Of Intervention
   *************************************************************************/
  createUpdateIntervention() {
    if (this.button === 'Add') {
      this.Intervention = this.sendIntervention.value;
      this.Intervention.resume_code = this.resumeCode;
      this.Intervention.intervention_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-INT`;
      if (this.sendIntervention.valid) {
        this.resumeService.addIntervention(this.Intervention).subscribe(data => {
          this.resumeService.getIntervention(
            `?intervention_code=${this.Intervention.intervention_code}`)
            .subscribe(
              (responseOne) => {
                if (responseOne['msg_code'] !== '0004') {
                  this.interventionArray.push(responseOne[0]);
                }});
        });
      } else {
        console.log('Form is not valid');
      }
      this.arrayInterventionCount++;
    } else {
      this.interventionUpdate = this.sendIntervention.value;
      this.interventionUpdate.intervention_code = this.intervention_code;
      this.interventionUpdate.resume_code = this.resumeCode;
      this.interventionUpdate._id = this.id;
      if (this.sendIntervention.valid && !this.showNumberError) {
        this.resumeService.updateIntervention(this.interventionUpdate).subscribe(data => {
          console.log('Intervention updated =', data);
          this.interventionArray.splice(this.indexUpdate, 0, this.interventionUpdate);
        });
        this.button = 'Add';
      }
    }

    this.sendIntervention.reset();
    this.showNumberError = false;
  }

  /**************************************************************************
   * @description Set data of a selected Level intervention and set it in the current form
   * @param intervention the Level intervention model
   * @param index the index of the selected Level of intervention
   *************************************************************************/
  EditForm(intervention: IResumeInterventionModel, index: number) {
    this.sendIntervention.patchValue({
      level_of_intervention_desc: intervention.level_of_intervention_desc,
    });
    this.interventionArray.splice(index, 1, );
    this.id = intervention._id;
    this.intervention_code = intervention.ResumeInterventionKey.intervention_code;
    this.indexUpdate = index;
    this.button = 'Save';
  }

  /**************************************************************************
   * @description Delete the selected Custom section
   * @param id the id of the deleted level of intervention
   * @param pointIndex the index of the deleted Level of intervention
   *************************************************************************/
  deleteIntervention(id: string, pointIndex: number) {
    const confirmation = {
      code: 'delete',
      title: 'resume-delete-interv',
      description: 'resume-u-sure',
    };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .subscribe(
        (res) => {
          if (res === true) {
            if (id !== undefined) {
            this.resumeService.deleteIntervention(id).subscribe(data => console.log('Deleted')); }
            this.interventionArray.forEach((value, index) => {
              if (index === pointIndex) {
                this.interventionArray.splice(index, 1);
              }
            });
            this.button = 'Add';
          }
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
}

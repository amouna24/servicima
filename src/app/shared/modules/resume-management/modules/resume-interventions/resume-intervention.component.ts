import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { IResumeInterventionModel } from '@shared/models/resumeIntervention.model';
import { UserService } from '@core/services/user/user.service';
import { Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';

@Component({
  selector: 'wid-resume-intervention',
  templateUrl: './resume-intervention.component.html',
  styleUrls: ['./resume-intervention.component.scss']
})
export class ResumeInterventionComponent implements OnInit {
  sendIntervention: FormGroup;
  arrayInterventionCount = 0;
  Intervention: IResumeInterventionModel;
  interventionArray: IResumeInterventionModel[] = [];
  resume_code = '';
  interventionUpdate: IResumeInterventionModel;
  intervention_code = '';
  button = 'Add';
  indexUpdate = 0 ;
  _id = '';
  subscriptionModal: Subscription;
  private showNumberError = false;
  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private userService: UserService,
    private modalServices: ModalService,
  ) { }
  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  ngOnInit(): void {
    this.getInterventionInfo();
    this.createForm();
  }
  /**************************************************************************
   * @description Get Intervention Data from Resume Service
   *************************************************************************/
  getInterventionInfo() {
    this.resumeService.getResume(
      // tslint:disable-next-line:max-line-length
      `?email_address=${this.userService.connectedUser$.getValue().user[0]['userKey']['email_address']}&company_email=${this.userService.connectedUser$.getValue().user[0]['company_email']}`)
      .subscribe(
        (response) => {
          this.resume_code = response[0].ResumeKey.resume_code.toString();
          console.log('resume code 1 =', this.resume_code);
          this.resumeService.getIntervention(
            `?resume_code=${this.resume_code}`)
            .subscribe(
              (responseOne) => {
                if (responseOne['msg_code'] !== '0004') {
                  console.log('response', responseOne);
                  this.interventionArray = responseOne;
                  this.interventionArray.forEach(
                    (func) => {
                      func.intervention_code = func.ResumeInterventionKey.intervention_code;
                    }
                  );
                }},
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
   * @description Inisaliszation of the Intervention Form
   */
  createForm() {
    this.sendIntervention = this.fb.group({
      level_of_intervention_desc : ['', [Validators.pattern('(?!^\\d+$)^.+$')]],
    });
  }
  /**
   * @description Create or Update Level Of Intervention
   */
  createUpdateIntervention() {
    if (this.button === 'Add') {
    this.Intervention = this.sendIntervention.value;
    this.Intervention.resume_code = this.resume_code;
    this.Intervention.intervention_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-INT`;
    if (this.sendIntervention.valid ) {
      console.log('intervention=', this.Intervention);
      this.resumeService.addIntervention(this.Intervention).subscribe(data => {
        console.log('Intervention =', data);
        this.getInterventionInfo();
      });
    } else { console.log('Form is not valid');
    }
    this.arrayInterventionCount++; } else {
      this.interventionUpdate = this.sendIntervention.value;
      this.interventionUpdate.intervention_code = this.intervention_code;
      this.interventionUpdate.resume_code = this.resume_code;
      this.interventionUpdate._id = this._id;
      console.log(' intervention update =', this.interventionUpdate);
      this.testNumber(this.Intervention.level_of_intervention_desc);
      if (this.sendIntervention.valid && !this.showNumberError) {
      this.resumeService.updateIntervention(this.interventionUpdate).subscribe(data => console.log('Intervention updated =', data));
      this.interventionArray[this.indexUpdate] = this.interventionUpdate;
      this.button = 'Add'; }
    }

    this.sendIntervention.reset();
    this.showNumberError = false;
  }
  /**************************************************************************
   * @description Test the Controls of the Form with a validation type
   *************************************************************************/
  isControlHasError(form: FormGroup, controlName: string, validationType: string): boolean {
    const control = form[controlName];
    if (!control) {
      return true;
    }
    return control.hasError(validationType) ;
  }
  /**************************************************************************
   * @description Set data of a selected Custom section and set it in the current form
   *************************************************************************/
  EditForm(_id: string, level_of_intervention_desc: string, intervention_code: string, index: number) {
    this.sendIntervention.patchValue({
      level_of_intervention_desc,
    });
    this._id = _id;
    this.intervention_code = intervention_code;
    this.indexUpdate = index;
    this.button = 'Save';
  }
  /**************************************************************************
   * @description Delete the selected Custom section
   *************************************************************************/
  deleteIntervention(_id: string, pointIndex: number) {
    const confirmation = {
      code: 'delete',
      title: 'Are you sure ?',
    };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .subscribe(
        (res) => {
          if (res === true) {
            this.resumeService.deleteIntervention(_id).subscribe(data => console.log('Deleted'));
            this.interventionArray.forEach((value, index) => {
              if (index === pointIndex) { this.interventionArray.splice(index, 1); }
            });
            this.button = 'Add';
            this.subscriptionModal.unsubscribe();
          }
        }
      );
  }
  /**************************************************************************
   * @description test if a control has numbers only
   *************************************************************************/
  testNumber(pos: string) {
    console.log('isNan=', !isNaN(+pos));
    if (this.showNumberError === false) {
      this.showNumberError = !isNaN(+pos);
    }
    console.log('position', this.showNumberError);
  }
  /**************************************************************************
   * @description test if there is an empty field , enable button add if all fields are not empty
   *************************************************************************/
  testRequired() {
    return (this.sendIntervention.invalid) ;
  }
}

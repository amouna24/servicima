import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { IResumeInterventionModel } from '@shared/models/resumeIntervention.model';
import { UserService } from '@core/services/user/user.service';

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
  resume_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-INT`;
  interventionUpdate: IResumeInterventionModel;
  intervention_code = '';
  button = 'Add';
  indexUpdate = 0 ;

  get getIntervention() {
    return this.interventionArray;
  }
  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.getInterventionInfo();
    this.createForm();
  }
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
   * @description Create Form
   */
  createForm() {
    this.sendIntervention = this.fb.group({
      level_of_intervention_desc : '',
    });
  }
  /**
   * @description Create Technical skill
   */
  createUpdateIntervention() {
    if (this.button === 'Add') {
    this.Intervention = this.sendIntervention.value;
    this.Intervention.resume_code = this.resume_code;
    this.Intervention.intervention_code = Math.random().toString();
    if (this.sendIntervention.valid) {
      console.log('intervention=', this.Intervention);
      this.resumeService.addIntervention(this.Intervention).subscribe(data => console.log('Intervention=', data));
      this.getIntervention.push(this.Intervention);
    } else { console.log('Form is not valid');
    }
    this.arrayInterventionCount++; } else {
      this.interventionUpdate = this.sendIntervention.value;
      this.interventionUpdate.intervention_code = this.intervention_code;
      this.interventionUpdate.resume_code = this.resume_code;
      console.log(' intervention update =', this.interventionUpdate);
      this.resumeService.updateIntervention(this.interventionUpdate).subscribe(data => console.log('Intervention updated =', data));
      this.interventionArray[this.indexUpdate] = this.interventionUpdate;
      this.button = 'Add';
    }

    this.sendIntervention.reset();
  }

  isControlHasError(form: FormGroup, controlName: string, validationType: string): boolean {
    const control = form[controlName];
    if (!control) {
      return true;
    }
    return control.hasError(validationType) ;
  }

  EditForm(level_of_intervention_desc: string, intervention_code: string, index: number) {
    this.sendIntervention.patchValue({
      level_of_intervention_desc,
    });
    this.intervention_code = intervention_code;
    this.indexUpdate = index;
    this.button = 'Save';
  }
}

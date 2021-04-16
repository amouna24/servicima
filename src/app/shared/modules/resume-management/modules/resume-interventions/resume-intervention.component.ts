import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { IResumeInterventionModel } from '@shared/models/resumeIntervention.model';

@Component({
  selector: 'wid-resume-intervention',
  templateUrl: './resume-intervention.component.html',
  styleUrls: ['./resume-intervention.component.scss']
})
export class ResumeInterventionComponent implements OnInit {
  sendIntervention: FormGroup;
  arrayInterventionCount = 0;
  Intervention: IResumeInterventionModel;
  get inputFields() {
    return this.sendIntervention.get('Field') as FormArray;
  }
  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  /**
   * @description Create Form
   */
  createForm() {
    this.sendIntervention = this.fb.group({
      Field: this.fb.array([this.fb.group({
        intervention_code: Math.random(),
      resume_code : Math.random(),
      level_of_intervention_desc : '',
    })])});
  }
  /**
   * @description Create Technical skill
   */
  createIntervention() {
    this.Intervention = this.sendIntervention.controls.Field.value;
    this.Intervention[this.arrayInterventionCount].resume_code = Math.random();
    this.Intervention[this.arrayInterventionCount].intervention_code = Math.random();
    if (this.sendIntervention.controls.Field.valid) {
      console.log(this.Intervention[this.arrayInterventionCount]);
      this.resumeService.addIntervention(this.Intervention[this.arrayInterventionCount]).subscribe(data => console.log('Intervention=', data));
      this.inputFields.push(this.fb.group({
        intervention_code: Math.random(),
        resume_code : Math.random(),
        level_of_intervention_desc : '', }));
    } else { console.log('Form is not valid');
    }
    this.arrayInterventionCount++;
  }
}

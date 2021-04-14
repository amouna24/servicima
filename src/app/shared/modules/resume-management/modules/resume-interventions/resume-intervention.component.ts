import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';

@Component({
  selector: 'wid-resume-intervention',
  templateUrl: './resume-intervention.component.html',
  styleUrls: ['./resume-intervention.component.scss']
})
export class ResumeInterventionComponent implements OnInit {
  CreationForm: FormGroup ;

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
    this.CreationForm = this.fb.group({
      intervention_code: Math.random(),
      resume_code : 'adsfdqds',
      level_of_intervention_desc : '',
    });
  }
  /**
   * @description Create Technical skill
   */
  createIntervention() {
    if (this.CreationForm.valid) {
      console.log(this.CreationForm.value);
      this.resumeService.addIntervention(this.CreationForm.value).subscribe(data => console.log('Intervention=', data));

    } else { console.log('Form is not valid');
    }
  }
}

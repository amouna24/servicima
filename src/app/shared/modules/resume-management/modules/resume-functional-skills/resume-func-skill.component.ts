import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';

@Component({
  selector: 'wid-resume-func-skill',
  templateUrl: './resume-func-skill.component.html',
  styleUrls: ['./resume-func-skill.component.scss']
})
export class ResumeFuncSkillComponent implements OnInit {
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
      functional_skills_code: Math.random(),
      resume_code : 'adsfdqds',
      skill : '',
      index: 0,
    });
  }
  /**
   * @description Create Technical skill
   */
  createFunctionalSkill() {
    if (this.CreationForm.valid) {
      console.log(this.CreationForm.value);
      this.resumeService.addFunctionalSkills(this.CreationForm.value).subscribe(data => console.log('functional skill =', data));

    } else { console.log('Form is not valid');
    }
  }
}

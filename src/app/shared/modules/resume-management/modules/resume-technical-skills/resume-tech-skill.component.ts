import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';

@Component({
  selector: 'wid-resume-tech-skill',
  templateUrl: './resume-tech-skill.component.html',
  styleUrls: ['./resume-tech-skill.component.scss']
})
export class ResumeTechSkillComponent implements OnInit {

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
  /**
   * @description Create Form
   */
  createForm() {
    this.CreationForm = this.fb.group({
      technical_skill_code: Math.random(),
      resume_code : 'aaaa',
      technical_skill_desc : '',
      technologies: '',
      skill_index: '',
    });
  }
  /**
   * @description Create Technical skill
   */
  createTechnicalSkill() {
    if (this.CreationForm.valid) {
      console.log(this.CreationForm.value);
      this.resumeService.addTechnicalSkills(this.CreationForm.value).subscribe(data => console.log('Technical skill =', data));

    } else { console.log('Form is not valid');
    }
  }
}

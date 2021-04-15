import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';

@Component({
  selector: 'wid-pro-exp',
  templateUrl: './pro-exp.component.html',
  styleUrls: ['./pro-exp.component.scss']
})
export class ProExpComponent implements OnInit {
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
      position: '',
      customer : '',
      resume_code : '',
      start_date: '',
      end_date: '',
      index: 0,
    });
  }
  /**
   * @description Create Technical skill
   */
  createProExp() {
    if (this.CreationForm.valid) {
      console.log(this.CreationForm.value);
      this.resumeService.addProExp(this.CreationForm.value).subscribe(data => console.log('functional skill =', data));

    } else { console.log('Form is not valid');
    }
  }
}

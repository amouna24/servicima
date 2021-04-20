import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { IResumeProfessionalExperienceModel } from '@shared/models/resumeProfessionalExperience.model';
import { UserService } from '@core/services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'wid-pro-exp',
  templateUrl: './pro-exp.component.html',
  styleUrls: ['./pro-exp.component.scss']
})
export class ProExpComponent implements OnInit {
  sendProExp: FormGroup;
  arrayProExpCount = 0;
  ProExp: IResumeProfessionalExperienceModel;
  proExpArray: IResumeProfessionalExperienceModel[] = [];
  resume_code: string;
  professional_experience_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-R-PE`;
  get getProExp() {
    return this.proExpArray;
  }
  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getProExpInfo();
  }
  getProExpInfo() {
    this.resumeService.getResume(
      // tslint:disable-next-line:max-line-length
      `?email_address=${this.userService.connectedUser$.getValue().user[0]['userKey']['email_address']}&company_email=${this.userService.connectedUser$.getValue().user[0]['company_email']}`)
      .subscribe(
        (response) => {
          this.resume_code = response[0].ResumeKey.resume_code.toString();
          console.log('resume code 1 =', this.resume_code);
          this.resumeService.getProExp(
            `?resume_code=${this.resume_code}`)
            .subscribe(
              (responseProExp) => {
                console.log('response', responseProExp);
                this.proExpArray = responseProExp;
              },
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
  routeToProject() {
    this.router.navigate(['/candidate/resume/projects'],
      { state: { id: this.professional_experience_code}
      });
  }

  /**
   * @description Create Form
   */
  createForm() {
    this.sendProExp = this.fb.group({
        position: '',
      customer : '',
      start_date: '',
      end_date: '',
      });
  }

  createProExp() {
    this.ProExp = this.sendProExp.value;
    this.ProExp.resume_code = this.resume_code;
    this.ProExp.professional_experience_code = this.professional_experience_code;
    if (this.sendProExp.valid) {
      console.log('ProExp input= ', this.ProExp);
      this.resumeService.addProExp(this.ProExp).subscribe(data => console.log('Professional experience =', data));
     this.proExpArray.push(this.ProExp);
    } else { console.log('Form is not valid');
    }
    this.arrayProExpCount++;
this.sendProExp.reset();
  }
}

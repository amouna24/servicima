import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { IResumeProfessionalExperienceModel } from '@shared/models/resumeProfessionalExperience.model';
import { UserService } from '@core/services/user/user.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

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
  resume_code = '';
  professional_experience_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-PE`;
  get getProExp() {
    return this.proExpArray;
  }
  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private userService: UserService,
    private router: Router,
    private datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.getProExpInfo();
    this.createForm();
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
                for (let i = 0; i < responseProExp.length; i++) {
                  this.proExpArray[i].start_date = this.proExpArray[i].ResumeProfessionalExperienceKey.start_date;
                  this.proExpArray[i].end_date = this.proExpArray[i].ResumeProfessionalExperienceKey.end_date;
                  this.proExpArray[i].professional_experience_code = this.proExpArray[i].ResumeProfessionalExperienceKey.professional_experience_code;
                }
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
  routeToProject(code: string, customer: string, position: string) {
    console.log('pro Exp Array=', this.proExpArray);
    this.router.navigate(['/candidate/resume/projects'],
      { state: {
        id: code,
        customer,
        position
      }
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
    this.ProExp.start_date = this.datepipe.transform(this.ProExp.start_date, 'yyyy/MM/dd');
    this.ProExp.end_date = this.datepipe.transform(this.ProExp.end_date, 'yyyy/MM/dd');
    if (this.sendProExp.valid) {
      console.log('ProExp input= ', this.ProExp);
      this.resumeService.addProExp(this.ProExp).subscribe(data => console.log('Professional experience =', data));
     this.proExpArray.push(this.ProExp);
    } else { console.log('Form is not valid');
    }
    this.arrayProExpCount++;
this.sendProExp.reset();
  }
  isControlHasError(form: FormGroup, controlName: string, validationType: string): boolean {
    const control = form[controlName];
    if (!control) {
      return true;
    }
    return control.hasError(validationType) ;
  }
}

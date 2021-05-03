import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { IResumeProfessionalExperienceModel } from '@shared/models/resumeProfessionalExperience.model';
import { UserService } from '@core/services/user/user.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDatepickerIntl } from '@angular/material/datepicker';
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
  professional_experience_code = '';
  minDate: Date;
  maxDate: Date;
  showDateError = false;
  button = 'Add';
  proExpUpdate: IResumeProfessionalExperienceModel;
  indexUpdate = 0;

  get getProExp() {
    return this.proExpArray;
  }

  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private userService: UserService,
    private router: Router,
    private datepipe: DatePipe,
  ) {
  }

  ngOnInit(): void {
    this.getProExpInfo();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDay();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(currentYear, currentMonth, currentDay + 25);
    console.log(this.maxDate);
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
                if (responseProExp['msg_code'] !== '0004') {
                  // data found
                  console.log('response', responseProExp);
                  this.proExpArray = responseProExp;
                  this.proExpArray.forEach(
                    (exp) => {
                      exp.start_date = exp.ResumeProfessionalExperienceKey.start_date;
                      exp.end_date = exp.ResumeProfessionalExperienceKey.end_date;
                      exp.professional_experience_code = exp.ResumeProfessionalExperienceKey.professional_experience_code;
                    }
                  );
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
      {
        state: {
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
      customer: '',
      start_date: '',
      end_date: '',
    });
  }
  createUpdateProExp(dateStart, dateEnd) {
    if (this.button === 'Add') {
    this.compareDate(dateStart, dateEnd);
    this.ProExp = this.sendProExp.value;
    this.ProExp.resume_code = this.resume_code;
    this.ProExp.professional_experience_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-PE`;
    this.ProExp.start_date = this.datepipe.transform(this.ProExp.start_date, 'yyyy/MM/dd');
    this.ProExp.end_date = this.datepipe.transform(this.ProExp.end_date, 'yyyy/MM/dd');
    if (this.sendProExp.valid && this.showDateError === false) {
      console.log('ProExp input= ', this.ProExp);
      this.resumeService.addProExp(this.ProExp).subscribe(data => console.log('Professional experience =', data));
      this.proExpArray.push(this.ProExp);
    } else {
      console.log('Form is not valid');
      this.showDateError = false;

    }
    this.arrayProExpCount++; } else {
      this.proExpUpdate = this.sendProExp.value;
      this.proExpUpdate.start_date = this.datepipe.transform(this.proExpUpdate.start_date, 'yyyy/MM/dd');
      this.proExpUpdate.end_date = this.datepipe.transform(this.proExpUpdate.end_date, 'yyyy/MM/dd');
      this.proExpUpdate.professional_experience_code = this.professional_experience_code;
      this.proExpUpdate.resume_code = this.resume_code;
      console.log('pro exp update = ', this.proExpUpdate);
      this.resumeService.updateProExp(this.proExpUpdate).subscribe(data => console.log('Professional experience updated =', data));
      this.proExpArray[this.indexUpdate] = this.proExpUpdate;
      this.button = 'Add';
    }
    this.sendProExp.reset();
  }
   isControlHasError(form: FormGroup, controlName: string, validationType: string): boolean {
    const control = form[controlName];
    if (!control) {
      return true;
    }
    return control.hasError(validationType);
  }
  compareDate(date1, date2) {
    console.log(date1 , '-----' , date2);
    const dateStart = new Date(date1);
    const dateEnd =  new Date(date2);
    if (dateStart.getTime() > dateEnd.getTime()) {
      console.log('illogic date');
      this.showDateError =  true;
    }

  }

  editForm(professional_experience_code: string, start_date: string, end_date: string, position: string, customer: string, index: number) {
    this.sendProExp.patchValue({
      start_date,
      end_date,
      position,
      customer,
    });
    this.button = 'Save';
    this.professional_experience_code = professional_experience_code;
    this.indexUpdate = index;

  }
}

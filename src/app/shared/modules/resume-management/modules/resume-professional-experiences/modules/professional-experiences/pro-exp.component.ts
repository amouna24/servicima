import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { IResumeProfessionalExperienceModel } from '@shared/models/resumeProfessionalExperience.model';
import { UserService } from '@core/services/user/user.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import { takeUntil } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';
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
  minStartDate: Date;
  maxStartDate: Date;
  minEndDate: Date;
  maxEndDate: Date;
  showDateError = false;
  button = 'Add';
  proExpUpdate: IResumeProfessionalExperienceModel;
  indexUpdate = 0;
  _id = '';
  subscriptionModal: Subscription;
  showPosError = false;

  get getProExp() {
    return this.proExpArray;
  }

  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private userService: UserService,
    private router: Router,
    public datepipe: DatePipe,
    private modalServices: ModalService
  ) {
  }

  ngOnInit(): void {
    this.getProExpInfo();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDay();
    this.minEndDate = new Date(currentYear - 20, 0, 1);
    this.maxEndDate = new Date(currentYear, currentMonth, currentDay + 25);
    this.minStartDate = new Date(currentYear - 20, 0, 1);
    this.maxEndDate = new Date(currentYear, currentMonth, currentDay + 25);
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

  routeToProject(code: string, customer: string, position: string, start_date: string, end_date: string) {
    this.router.navigate(['/candidate/resume/projects'],
      {
        state: {
          id: code,
          customer,
          position,
          start_date,
          end_date,
        }
      });
  }
  /**
   * @description Create Form
   */
  createForm() {
    this.sendProExp = this.fb.group({
      position:  ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      customer: ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      start_date:  ['', [Validators.required]],
      end_date:  ['', [Validators.required]],
    });
  }

  createUpdateProExp(dateStart, dateEnd) {
    if (this.button === 'Add') {
    this.ProExp = this.sendProExp.value;
    this.ProExp.resume_code = this.resume_code;
    this.ProExp.professional_experience_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-PE`;
      if (this.sendProExp.valid && this.showDateError === false ) {
      console.log('ProExp input= ', this.ProExp);
      this.resumeService.addProExp(this.ProExp).subscribe(data => console.log('Professional experience =', data));
      this.getProExpInfo();
    } else {
      console.log('Form is not valid');
      this.showDateError = false;
      this.showPosError = false;

    }
    this.arrayProExpCount++; } else {
      this.proExpUpdate = this.sendProExp.value;
      this.proExpUpdate.professional_experience_code = this.professional_experience_code;
      this.proExpUpdate.resume_code = this.resume_code;
      console.log('pro exp update = ', this.proExpUpdate);
      this.proExpUpdate._id = this._id;

      if (this.sendProExp.valid && this.showDateError === false ) {
        this.resumeService.updateProExp(this.proExpUpdate).subscribe(data => console.log('Professional experience updated =', data));
      this.proExpArray[this.indexUpdate] = this.proExpUpdate;
      this.button = 'Add'; }
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

  // tslint:disable-next-line:max-line-length
  editForm(_id: string, professional_experience_code: string, start_date: string, end_date: string, position: string, customer: string, index: number) {
    this.sendProExp.patchValue({
      start_date,
      end_date,
      position,
      customer,
    });
    this._id = _id;
    this.button = 'Save';
    this.professional_experience_code = professional_experience_code;
    this.indexUpdate = index;

  }

  deleteProExp(_id: string, pointIndex: number, professional_experience_code: string) {
    const confirmation = {
      code: 'delete',
      title: 'delete',
    };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .subscribe(
        (res) => {
          if (res === true) {
            this.resumeService.deleteProExp(_id).subscribe(data => console.log('Deleted'));
            this.resumeService.getProject(
              // tslint:disable-next-line:max-line-length
              `?professional_experience_code=${professional_experience_code}`)
              .subscribe(
                (response) => {
                  if (response['msg_code'] !== '0004') {
                    console.log('response=', response);
                    response.forEach((project) => {
                      this.resumeService.deleteProject(project._id).subscribe(data => console.log('Deleted'));

                      this.resumeService.getProjectDetails(
                        // tslint:disable-next-line:max-line-length
                        `?project_code=${project.ResumeProjectKey.project_code}`)
                        .subscribe(
                          (responsedet) => {
                            if (responsedet['msg_code'] !== '0004') {
                              console.log('response=', responsedet);
                              responsedet.forEach((det) => {
                                this.resumeService.deleteProjectDetails(det._id).subscribe(data => console.log('Deleted'));
                                this.resumeService.getProjectDetailsSection(
                                  // tslint:disable-next-line:max-line-length
                                  `?project_details_code=${det.ResumeProjectDetailsKey.project_details_code}`)
                                  .subscribe(
                                    (responsedetsec) => {
                                      if (responsedetsec['msg_code'] !== '0004') {
                                        console.log('responsedet=', responsedetsec);
                                        responsedetsec.forEach((section) => {
                                          console.log('section', section);
                                          this.resumeService.deleteProjectDetailsSection(section._id).subscribe(data => console.log('Deleted'));
                                        });
                                      }
                                    });
                              });
                            }
                          });
                    });
                  }
                  this.proExpArray.forEach((value, index) => {
                    if (index === pointIndex) {
                      this.proExpArray.splice(index, 1);
                    }
                  });
                  this.button = 'Add';
                });

          }
          this.subscriptionModal.unsubscribe();
        });
  }
  onChangeStartDate(date: string) {
    console.log(date);
    this.minEndDate = new Date(date);
    console.log('min date after change', this.minEndDate);
  }
  onChangeEndDate(date: string) {
    console.log(date);
    this.maxStartDate = new Date(date);
    console.log('max date after change', this.maxStartDate);
  }
}

import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { IResumeProfessionalExperienceModel } from '@shared/models/resumeProfessionalExperience.model';
import { UserService } from '@core/services/user/user.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';
@Component({
  selector: 'wid-pro-exp',
  templateUrl: './pro-exp.component.html',
  styleUrls: ['./pro-exp.component.scss']
})
export class ProExpComponent implements OnInit {

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
  // tslint:disable-next-line:max-line-length
  disableDate = false;
  startDateUpdate = '';
  endDAteUpdate = '';
  myDisabledDayFilter;
  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  ngOnInit(): void {
    this.getProExpInfo();
    this.initDates();
    this.createForm();
  }
  /**************************************************************************
   * @description Get Professional Data from Resume Service
   *************************************************************************/
  getProExpInfo() {
    this.resumeService.getResume(
      // tslint:disable-next-line:max-line-length
      `?email_address=${this.userService.connectedUser$.getValue().user[0]['userKey']['email_address']}&company_email=${this.userService.connectedUser$.getValue().user[0]['company_email']}`)
      .subscribe(
        (response) => {
          if (response['msg_code'] !== '0004') {
            this.resume_code = response[0].ResumeKey.resume_code.toString();
          this.resumeService.getProExp(
            `?resume_code=${this.resume_code}`)
            .subscribe(
              (responseProExp) => {
                if (responseProExp['msg_code'] !== '0004') {
                  // data found
                  this.proExpArray = responseProExp;
                  this.filterDate();
                }
              },
              (error) => {
                if (error.error.msg_code === '0004') {
                }
              },
            );
          } else {
            this.router.navigate(['/candidate/resume/']);
          }},
        (error) => {
          if (error.error.msg_code === '0004') {
          }
        },
      );

  }
  /**************************************************************************
   * @description Action that Route to Professional experience project component with passing parametrs in the state
   *************************************************************************/
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
      this.resumeService.addProExp(this.ProExp).subscribe(data => console.log('Professional experience =', data));
    this.arrayProExpCount++; } else {
      this.proExpUpdate = this.sendProExp.value;
      this.proExpUpdate.start_date = this.startDateUpdate;
      this.proExpUpdate.end_date = this.endDAteUpdate;
      this.proExpUpdate.professional_experience_code = this.professional_experience_code;
      this.proExpUpdate.resume_code = this.resume_code;
      this.proExpUpdate._id = this._id;
      if (this.sendProExp.valid && this.showDateError === false ) {
        this.resumeService.updateProExp(this.proExpUpdate).subscribe(data => console.log('Professional experience updated =', data));
      this.proExpArray[this.indexUpdate] = this.proExpUpdate;
      this.button = 'Add';
        this.sendProExp.controls.start_date.enable();
        this.sendProExp.controls.end_date.enable();
      this.disableDate = false;
      }
    }
    this.createForm();
    this.initDates();
    this.getProExpInfo();
  }
  // tslint:disable-next-line:max-line-length
  editForm(_id: string, professional_experience_code: string, start_date: string, end_date: string, position: string, customer: string, index: number) {
    this.sendProExp.patchValue({
      start_date,
      end_date,
      position,
      customer,
    });
    this.startDateUpdate = this.sendProExp.controls.start_date.value;
    this.endDAteUpdate = this.sendProExp.controls.end_date.value;
    this.sendProExp.controls.start_date.disable();
 this.sendProExp.controls.end_date.disable();

    this._id = _id;
    this.button = 'Save';
    this.professional_experience_code = professional_experience_code;
    this.indexUpdate = index;

  }

  deleteProExp(_id: string, pointIndex: number, professional_experience_code: string) {
    const confirmation = {
      code: 'delete',
      title: 'delete',
      description: 'Are you sure ?',
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
                    response.forEach((project) => {
                      this.resumeService.deleteProject(project._id).subscribe(data => console.log('Deleted'));

                      this.resumeService.getProjectDetails(
                        // tslint:disable-next-line:max-line-length
                        `?project_code=${project.ResumeProjectKey.project_code}`)
                        .subscribe(
                          (responsedet) => {
                            if (responsedet['msg_code'] !== '0004') {
                              responsedet.forEach((det) => {
                                this.resumeService.deleteProjectDetails(det._id).subscribe(data => console.log('Deleted'));
                                this.resumeService.getProjectDetailsSection(
                                  // tslint:disable-next-line:max-line-length
                                  `?project_details_code=${det.ResumeProjectDetailsKey.project_details_code}`)
                                  .subscribe(
                                    (responsedetsec) => {
                                      if (responsedetsec['msg_code'] !== '0004') {
                                        responsedetsec.forEach((section) => {
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
                  this.filterDate();
                  this.button = 'Add';
                });

          }
          this.subscriptionModal.unsubscribe();
        });
  }
  onChangeStartDate(date: string) {
    this.minEndDate = new Date(date);
  }
  onChangeEndDate(date: string) {
    this.maxStartDate = new Date(date);
  }
  filterDate() {
    const disabledDates = [];
    this.proExpArray.forEach(
      (exp) => {
        exp.start_date = exp.ResumeProfessionalExperienceKey.start_date;
        exp.end_date = exp.ResumeProfessionalExperienceKey.end_date;
        exp.professional_experience_code = exp.ResumeProfessionalExperienceKey.professional_experience_code;
        for (const date = new Date(exp.start_date) ; date <= new Date(exp.end_date) ; date.setDate(date.getDate() + 1)) {
          disabledDates.push(new Date(date));
        }
      }
    );
    this.myDisabledDayFilter = (d: Date): boolean => {
      const time = d.getTime();
      return !disabledDates.find(x => x.getTime() === time);
    };
  }
  initDates() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    this.minEndDate = new Date(currentYear - 20, 0, 1);
    this.maxEndDate = new Date(currentYear, currentMonth, currentDay);
    this.minStartDate = new Date(currentYear - 20, 0, 1);
    this.maxStartDate = new Date(currentYear, currentMonth, currentDay);
  }
}

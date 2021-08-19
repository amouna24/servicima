import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { IResumeProfessionalExperienceModel } from '@shared/models/resumeProfessionalExperience.model';
import { UserService } from '@core/services/user/user.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { blueToGrey, downLine, GreyToBlue, showBloc, showProExp } from '@shared/animations/animations';

@Component({
  selector: 'wid-pro-exp',
  templateUrl: './pro-exp.component.html',
  styleUrls: ['./pro-exp.component.scss'],
  animations: [
    blueToGrey,
    GreyToBlue,
    downLine,
    showBloc,
    showProExp,

  ]
})
export class ProExpComponent implements OnInit {
  sendProExp: FormGroup;
  arrayProExpCount = 0;
  ProExp: IResumeProfessionalExperienceModel;
  proExpArray: IResumeProfessionalExperienceModel[];
  resumeCode: string;
  professional_experience_code: string;
  minStartDate: Date;
  maxStartDate: Date;
  minEndDate: Date;
  maxEndDate: Date;
  showDateError: boolean;
  disableCheckBox: boolean;
  checkedBox: boolean;
  button: string;
  proExpUpdate: IResumeProfessionalExperienceModel;
  indexUpdate = 0;
  id: string;
  subscriptionModal: Subscription;
  showPosError: boolean;
  disableDate: boolean;
  startDateUpdate: string;
  endDAteUpdate: string;
  myDisabledDayFilter;
 placeHolderEndDate: string;
  /**********************************************************************
   * @description Resume Professional experience constructor
   *********************************************************************/
  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private userService: UserService,
    private router: Router,
    public datePipe: DatePipe,
    private modalServices: ModalService
  ) {
    this.resumeCode = this.router.getCurrentNavigation()?.extras?.state?.resumeCode;
  }

  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  ngOnInit(): void {
    this.checkedBox = false;
    this.placeHolderEndDate = 'resume-end-date';
    this.button = 'Add';
    this.initBooleanVars();
    this.initDates();
    this.proExpArray = [];
    this.getProExpInfo();
    this.createForm();
  }

  /**************************************************************************
   * @description Get Professional Data from Resume Service
   *************************************************************************/
  getProExpInfo() {
    if (this.resumeCode) {
      this.resumeService.getProExp(
        `?resume_code=${this.resumeCode}`)
        .subscribe(
          (responseProExp) => {
            if (responseProExp['msg_code'] !== '0004') {
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
    this.resumeService.getResume(
      `?email_address=${this.userService.connectedUser$.getValue()
        .user[0]['userKey']['email_address']}&company_email=${this.userService.connectedUser$.getValue()
        .user[0]['company_email']}`).subscribe((response) => {
        if (response['msg_code'] !== '0004') {
          this.resumeCode = response[0].ResumeKey.resume_code.toString();
          this.resumeService.getProExp(
            `?resume_code=${this.resumeCode}`)
            .subscribe(
              (responseProExp) => {
                if (responseProExp['msg_code'] !== '0004') {
                  this.proExpArray = responseProExp;
                  this.filterDate();
                }
              },
              (error) => {
                if (error.error.msg_code === '0004') {
                }
              },
            );
        }
      },
      (error) => {
        if (error.error.msg_code === '0004') {
        }
      },
    );
    }
  }

  /**************************************************************************
   * @description Action that Route to Professional experience project component with passing parametrs in the state
   * @param professionalExp the professionalExperience model
   *************************************************************************/
  routeToProject(professionalExp: IResumeProfessionalExperienceModel) {
    if (this.userService.connectedUser$.getValue().user[0].user_type === 'COMPANY') {
      this.router.navigate(['/manager/resume/projects'],
        {
          state: {
            resumeCode: this.resumeCode,
            id: professionalExp.ResumeProfessionalExperienceKey.professional_experience_code,
            customer: professionalExp.customer,
            position: professionalExp.position,
            start_date: professionalExp.start_date,
            end_date: professionalExp.end_date,
          }
        });
    } else {
      this.router.navigate(['/candidate/resume/projects'],
        {
          state: {
            resumeCode: this.resumeCode,
            id: professionalExp.ResumeProfessionalExperienceKey.professional_experience_code,
            customer: professionalExp.customer,
            position: professionalExp.position,
            start_date: professionalExp.start_date,
            end_date: professionalExp.end_date,
          }
        });
    }

  }

  /*******************************************************************
   * @description Create Form
   *******************************************************************/
  createForm() {
    this.sendProExp = this.fb.group({
      position: ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      customer: ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
    });
  }

  /*******************************************************************
   * @description Create or update a professional experience
   *******************************************************************/
  createUpdateProExp() {
    if (this.button === 'Add') {
      this.ProExp = this.sendProExp.value;
      if (!this.sendProExp.controls.end_date.value) {
        this.ProExp.end_date = 'Current Date';
      }
      this.ProExp.resume_code = this.resumeCode;
      this.ProExp.professional_experience_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-PE`;
      this.resumeService.addProExp(this.ProExp).subscribe(data => {
        this.disableCheckBox = false;
        this.checkedBox = false;
        this.placeHolderEndDate = 'resume-end-date';
        this.sendProExp.controls.end_date.enable();
        this.sendProExp.controls.end_date.setValue('');
        this.resumeService.getProExp(
          `?professional_experience_code=${this.ProExp.professional_experience_code}`)
          .subscribe(
            (responseOne) => {
              if (responseOne['msg_code'] !== '0004') {
                this.proExpArray.push(responseOne[0]);
                this.filterDate();
                this.arrayProExpCount++;
              }});
      });
    } else {
      this.proExpUpdate = this.sendProExp.value;
      this.proExpUpdate.start_date = this.startDateUpdate;
      this.proExpUpdate.end_date = this.endDAteUpdate;
      this.proExpUpdate.professional_experience_code = this.professional_experience_code;
      this.proExpUpdate.resume_code = this.resumeCode;
      this.proExpUpdate._id = this.id;
      if (this.sendProExp.valid) {
        this.resumeService.updateProExp(this.proExpUpdate).subscribe(data => {
          console.log('Professional experience updated =', data);
          this.proExpArray.splice(this.indexUpdate, 0 , data);
          this.filterDate();
        });
        this.button = 'Add';
        this.sendProExp.controls.start_date.enable();
        this.sendProExp.controls.end_date.enable();
        this.disableDate = false;
      }
    }
    this.createForm();
    this.initDates();
  }

  /**************************************************************************
   * @description get data from a selected professional experience and set it in the current form
   * @param professionalExp the Professional Experience model
   * @param index the index of the selected Professional experience
   *************************************************************************/
  editForm(professionalExp: IResumeProfessionalExperienceModel, index: number) {
    this.sendProExp.patchValue({
      start_date: professionalExp.ResumeProfessionalExperienceKey.start_date,
      end_date: professionalExp.ResumeProfessionalExperienceKey.end_date,
      position: professionalExp.position,
      customer: professionalExp.customer,
    });
    this.startDateUpdate = this.sendProExp.controls.start_date.value;
    this.endDAteUpdate = this.sendProExp.controls.end_date.value;
    this.sendProExp.controls.start_date.disable();
    this.sendProExp.controls.end_date.disable();
    this.proExpArray.splice(index, 1);
    this.id = professionalExp._id;
    this.button = 'Save';
    this.professional_experience_code = professionalExp.ResumeProfessionalExperienceKey.professional_experience_code;
    this.indexUpdate = index;
    this.disableCheckBox = true;
  }

  /**************************************************************************
   * @description Delete Selected Functional Skilll
   * @param id the id of the deleted functionnal skill
   * @param pointIndex the index of the deleted functional skill
   * @param professional_experience_code it contains te professional experience code
   *************************************************************************/
  deleteProExp(id: string, pointIndex: number, professional_experience_code: string) {
    const confirmation = {
      code: 'delete',
      title: 'resume-delete-pro-exp',
      description: 'resume-u-sure',
    };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .subscribe(
        (res) => {
          if (res === true) {
            this.resumeService.deleteProExp(id).subscribe(data => {
              this.disableCheckBox = false;
              this.filterDate();
            });
            this.resumeService.getProject(
              `?professional_experience_code=${professional_experience_code}`)
              .subscribe(
                (response) => {
                  if (response['msg_code'] !== '0004') {
                    response.forEach((project) => {
                      this.resumeService.deleteProject(project._id).subscribe(data => console.log('Deleted'));

                      this.resumeService.getProjectDetails(
                        `?project_code=${project.ResumeProjectKey.project_code}`)
                        .subscribe(
                          (responseDet) => {
                            if (responseDet['msg_code'] !== '0004') {
                              responseDet.forEach((det) => {
                                this.resumeService.deleteProjectDetails(det._id).subscribe(data => console.log('Deleted'));
                                this.resumeService.getProjectDetailsSection(
                                  // tslint:disable-next-line:max-line-length
                                  `?project_details_code=${det.ResumeProjectDetailsKey.project_details_code}`)
                                  .subscribe(
                                    (responseDetSec) => {
                                      if (responseDetSec['msg_code'] !== '0004') {
                                        responseDetSec.forEach((section) => {
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
                });

          }
          this.subscriptionModal.unsubscribe();
        });
  }

  /*******************************************************************
   * @description Change the minimum of the end date
   * @param date the minimum of the end date
   *******************************************************************/
  onChangeStartDate(date: string) {
    this.minEndDate = new Date(date);
  }

  /*******************************************************************
   * @description Change the maximum of the start date
   * @param date the maximum of the start date
   *******************************************************************/
  onChangeEndDate(date: string) {
    this.maxStartDate = new Date(date);
  }

  /*******************************************************************
   * @description Filter Dates that are already taken by other experiences
   *******************************************************************/
  filterDate() {
    const disabledDates = [];
    this.proExpArray.forEach(
      (exp) => {
        if (exp.ResumeProfessionalExperienceKey.end_date === 'Current Date') {
          exp.ResumeProfessionalExperienceKey.end_date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        }
        exp.start_date = exp.ResumeProfessionalExperienceKey.start_date;
        exp.end_date = exp.ResumeProfessionalExperienceKey.end_date;
        exp.professional_experience_code = exp.ResumeProfessionalExperienceKey.professional_experience_code;
        for (const date = new Date(exp.start_date); date <= new Date(exp.end_date); date.setDate(date.getDate() + 1)) {
          disabledDates.push(new Date(date));
        }
        if (this.datePipe.transform(exp.ResumeProfessionalExperienceKey.end_date, 'yyyy-MM-dd') === this.datePipe
          .transform(new Date(), 'yyyy-MM-dd')) {
          this.checkedBox = false;
          this.disableCheckBox = true;
        }
      }
    );
    this.myDisabledDayFilter = (d: Date): boolean => {
      const time = d.getTime();
      return !disabledDates.find(x => x.getTime() === time);
    };
  }

  /*******************************************************************
   * @description Initialize Max end Min Dates
   *******************************************************************/
  initDates() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    this.minEndDate = new Date(currentYear - 20, 0, 1);
    this.maxEndDate = new Date(currentYear, currentMonth, currentDay);
    this.minStartDate = new Date(currentYear - 20, 0, 1);
    this.maxStartDate = new Date(currentYear, currentMonth, currentDay);
  }

  /*******************************************************************
   * @description Action on checkbox of the current date
   * @param event event of the checkbox
   *******************************************************************/
  checkCurrentDate(event: MatCheckboxChange) {
    if (event.checked) {
      this.sendProExp.controls.end_date.setValue('');
      this.sendProExp.controls.end_date.disable();
      this.placeHolderEndDate = 'Present';
      this.checkedBox = true;
    } else {
      this.checkedBox = false;
      this.placeHolderEndDate = 'resume-end-date';
      this.sendProExp.controls.end_date.enable();
      this.sendProExp.controls.end_date.setValue('');
    }
  }

  /*******************************************************************
   * @description initialize Boolean variables
   *******************************************************************/
  initBooleanVars() {
    this.showDateError = false;
    this.disableCheckBox = false;
    this.checkedBox = false;
    this.showPosError = false;
    this.disableDate = false;
  }
  /**************************************************************************
   * @description Show indexation
   *************************************************************************/
  addIndexation() {
    const indexationArray = [];
    for (let i = 1; i < 10; i++) {
      indexationArray[i] = '0' + i.toString();
    }
    return(indexationArray);
  }
  /**************************************************************************
   * @description Route to next page or to the previous page
   * @param typeRoute type of route previous or next
   *************************************************************************/
  routeNextBack(typeRoute: string) {

    if (this.userService.connectedUser$.getValue().user[0].user_type === 'COMPANY') {
      if (typeRoute === 'next') {
        this.router.navigate(['/manager/resume/dynamicSection'], {
          state: {
            resumeCode: this.resumeCode
          }
        });
      } else {
        this.router.navigate(['/candidate/resume/intervention'], {
          state: {
            resumeCode: this.resumeCode
          }
        });
      } } else {
        if (typeRoute === 'next') {
          this.router.navigate(['/candidate/resume/dynamicSection'], {
            state: {
              resumeCode: this.resumeCode
            }
          });
        } else {
          this.router.navigate(['/candidate/resume/intervention'], {
            state: {
              resumeCode: this.resumeCode
            }
          });
        }
      }

  }
}

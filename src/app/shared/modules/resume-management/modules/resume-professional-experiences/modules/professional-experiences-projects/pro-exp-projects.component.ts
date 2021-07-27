import { Component , OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { UserService } from '@core/services/user/user.service';
import { IResumeProjectModel } from '@shared/models/resumeProject.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';
@Component({
  selector: 'wid-pro-exp-projects',
  templateUrl: './pro-exp-projects.component.html',
  styleUrls: ['./pro-exp-projects.component.scss']
})
export class ProExpProjectsComponent implements OnInit {

  sendProject: FormGroup;
  arrayProjectCount = 0;
  Project: IResumeProjectModel;
  showProject: boolean;
  ProjectArray: IResumeProjectModel[];
  professionalExperienceCode: string;
  customer: string;
  position: string;
  startDateProExp: Date;
  endDateProExp: Date;
  showAddSection: boolean;
  showForm: boolean;
  project_code: string;
  indexUpdate = 0;
  button: string;
  id: string;
  projectUpdate: IResumeProjectModel;
  subscriptionModal: Subscription;
  minStartDate: Date;
  maxStartDate: Date;
  minEndDate: Date;
  maxEndDate: Date;
  showDateError: boolean;
  showNumberError: boolean;
  startDate: string;
  endDate: string;
  myDisabledDayFilter: any ;
  /**********************************************************************
   * @description Resume Professional experience constructor
   *********************************************************************/
  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private userService: UserService,
    private router: Router,
    private modalServices: ModalService,
  ) {
    this.getDataFromPreviousRoute();
  }
  /**************************************************************************
   * @description Set all functions that needs to be loaded on component init
   *************************************************************************/
  ngOnInit(): void {
    this.createForm();
    this.ProjectArray = [];
    this.showProject = false;
    this.showAddSection = false;
    this.showForm = false;
    this.button = 'Add';
    this.showDateError = false;
    this.showNumberError = false;
    this.project_code = '';
    this.getProjectInfo();
    this.createForm();
    this.initDates();

  }
  /**************************************************************************
   * @description Get Project Data from Resume Service
   *************************************************************************/
  getProjectInfo() {
    const disabledDates = [];
    this.resumeService.getProject(
      // tslint:disable-next-line:max-line-length
      `?professional_experience_code=${this.professionalExperienceCode}`)
      .subscribe(
        (response) => {
          if (response['msg_code'] !== '0004') {
            this.ProjectArray = response;
            if (this.ProjectArray.length !== 0) {
              this.showProject = true;
              this.showForm = false;
              this.ProjectArray.forEach(
                (project) => {
                  project.project_code = project.ResumeProjectKey.project_code;
                  for (const date = new Date(project.start_date) ; date <= new Date(project.end_date) ; date.setDate(date.getDate() + 1)) {
                    disabledDates.push(new Date(date));
                  }
                });
              this.myDisabledDayFilter = (d: Date): boolean => {
                const time = d.getTime();
                return !disabledDates.find(x => x.getTime() === time);
              };
              this.filterDate();
            }
          } },
        (error) => {
          if (error.error.msg_code === '0004') {
          }
        },
      );

  }
  /**************************************************************************
   * @description Create Project Form
   *************************************************************************/
  createForm() {
    this.sendProject = this.fb.group({
      project_title:  ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
    });
  }
  /**************************************************************************
   * @description Create or UpdateProject
   * @param dateEnd contains the end date added by the user
   * @param dateStart contains the start date added by the user
   *************************************************************************/
  createUpdateProject(dateStart: string, dateEnd: string) {
    if (this.button === 'Add') {
      this.startDate = dateStart;
      this.endDate = dateEnd;
    this.Project = this.sendProject.value;
    this.Project.professional_experience_code = this.professionalExperienceCode;
    this.Project.project_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-PE-P`;
    if (this.sendProject.valid ) {
      console.log(this.Project);
      this.resumeService.addProject(this.Project).subscribe(data => {
        this.getProjectInfo();
      });
      this.showForm = false;
    } else { console.log('Form is not valid');
      this.showDateError = false;
    }
    this.arrayProjectCount++; } else {
      this.projectUpdate = this.sendProject.value;
      this.projectUpdate.project_code = this.project_code;
      this.projectUpdate.professional_experience_code = this.professionalExperienceCode;
      this.projectUpdate._id = this.id;
      if (this.sendProject.valid) {
        this.resumeService.updateProject(this.projectUpdate).subscribe(data => console.log('project updated =', data));
      this.ProjectArray[this.indexUpdate] = this.projectUpdate;
      this.button = 'Add';
        this.showForm = false; }
    }
this.createForm();
this.initDates();
this.filterDate();
this.showNumberError = false ;
  }
  /**************************************************************************
   * @description action allows to show or hide project form
   *************************************************************************/
  onShowForm() {
    this.showForm = true;
  }
  /**************************************************************************
   * @description Set data of a selected Project and set it in the current form
   * @param oneProject the  Project model
   * @param pointIndex the index of the selected Project
   *************************************************************************/
  editForm(oneProject: IResumeProjectModel, pointIndex: number) {
    let projectEditArray: any[];
    const disabledDates = [];
    this.sendProject.patchValue({
      project_title: oneProject.project_title,
      start_date: oneProject.start_date,
      end_date: oneProject.end_date,
    });
    this.myDisabledDayFilter = null;
    this.project_code = oneProject.ResumeProjectKey.project_code;
    this.id = oneProject._id.toString();
    this.indexUpdate = pointIndex;
    this.button = 'Save';
    this.showForm = true;
    projectEditArray = [...this.ProjectArray];
    projectEditArray.splice(pointIndex, 1);
    projectEditArray.forEach(
      (project) => {
        project.project_code = project.ResumeProjectKey.project_code;
        for (const date = new Date(project.start_date) ; date <= new Date(project.end_date) ; date.setDate(date.getDate() + 1)) {
          disabledDates.push(new Date(date));
        }
      });
    this.myDisabledDayFilter = (d: Date): boolean => {
      const time = d.getTime();
      return !disabledDates.find(x => x.getTime() === time);
    };
  }
  /**************************************************************************
   * @description Delete the selected Project
   * @param id the id of the deleted Project
   * @param pointIndex the index of the deleted Project
   * @param project_code it contains the project code
   *************************************************************************/
  deleteProject(id: string, pointIndex: number, project_code: string) {
    const confirmation = {
      code: 'delete',
      title: 'resume-delete-project',
      description: 'resume-u-sure',
    };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .subscribe(
        (res) => {
          if (res === true) {
            this.resumeService.deleteProject(id).subscribe(data => console.log('Deleted'));
            this.resumeService.getProjectDetails(
              // tslint:disable-next-line:max-line-length
              `?project_code=${project_code}`)
              .subscribe(
                (response) => {
                  if (response['msg_code'] !== '0004') {
                    response.forEach((det) => {
                      this.resumeService.deleteProjectDetails(det._id).subscribe(data => console.log('Deleted'));
                      this.resumeService.getProjectDetailsSection(
                        // tslint:disable-next-line:max-line-length
                        `?project_details_code=${det.ResumeProjectDetailsKey.project_details_code}`)
                        .subscribe(
                          (responsedet) => {
                            if (responsedet['msg_code'] !== '0004') {
                              responsedet.forEach((section) => {
                                this.resumeService.deleteProjectDetailsSection(section._id).subscribe(data => console.log('Deleted'));
                              });
                            }
                          },
                          (error) => {
                            if (error.error.msg_code === '0004') {
                            }
                          },
                        );
                    });

                  }
                  this.ProjectArray.forEach((value, index) => {
                    if (index === pointIndex) {
                      this.ProjectArray.splice(index, 1);
                    }
                  });
                  this.filterDate();
                  this.createForm();
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
   * @description Filter Dates that are already taken by other project
   * @return !disabledDates return enabled dates
   *******************************************************************/
  filterDate() {
    const disabledDates = [];
    this.ProjectArray.forEach(
      (project) => {
        for (const date = new Date(project.start_date) ; date <= new Date(project.end_date) ; date.setDate(date.getDate() + 1)) {
          disabledDates.push(new Date(date));
        }
      });
    this.myDisabledDayFilter = (d: Date): boolean => {
      const time = d.getTime();
      return !disabledDates.find(x => x.getTime() === time);
    };
  }
  /*******************************************************************
   * @description Initialize Max end Min Dates
   *******************************************************************/
  initDates() {
    this.minEndDate = this.startDateProExp;
    this.maxEndDate =  this.endDateProExp;
    this.minStartDate = this.startDateProExp;
    this.maxStartDate = this.endDateProExp;
  }
  /*******************************************************************
   * @description Action allows to show the project page
   *******************************************************************/
  onShowProject() {
    this.showProject = !this.showProject;
    this.showForm = !this.showForm;
  }
  /*******************************************************************
   * @description initialize data that are coming from the previous route
   *******************************************************************/
  getDataFromPreviousRoute() {
    this.professionalExperienceCode = this.router.getCurrentNavigation().extras.state?.id;
    this.customer = this.router.getCurrentNavigation().extras.state?.customer;
    this.position = this.router.getCurrentNavigation().extras.state?.position;
    this.startDateProExp = this.router.getCurrentNavigation().extras.state?.start_date;
    this.endDateProExp = this.router.getCurrentNavigation().extras.state?.end_date;
  }
}

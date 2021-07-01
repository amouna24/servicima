import { Component , OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  showProject = false;
  ProjectArray: IResumeProjectModel[] = [];
  professional_experience_code = this.router.getCurrentNavigation().extras.state?.id;
  customer = this.router.getCurrentNavigation().extras.state?.customer;
  position = this.router.getCurrentNavigation().extras.state?.position;
  start_date_pro_exp = this.router.getCurrentNavigation().extras.state?.start_date;
  end_date_pro_exp = this.router.getCurrentNavigation().extras.state?.end_date;
  showAddSection = false;
  showForm = false;
  project_code = '';
  indexUpdate = 0;
  button = 'Add';
  _id = '';
  projectUpdate: IResumeProjectModel;
  subscriptionModal: Subscription;
  minStartDate: Date;
  maxStartDate: Date;
  minEndDate: Date;
  maxEndDate: Date;
  showDateError = false;
  showNumberError = false;
  start_date: any;
  end_date: any;
  get getProject() {
    return this.ProjectArray;
  }
  onShowProject() {
    this.showProject = !this.showProject;
    this.showForm = !this.showForm;
  }

  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private userService: UserService,
    private router: Router,
    private modalServices: ModalService,
  ) { }
  getProjectInfo() {
    this.resumeService.getProject(
      // tslint:disable-next-line:max-line-length
      `?professional_experience_code=${this.professional_experience_code}`)
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
                });
            }
          } },
        (error) => {
          if (error.error.msg_code === '0004') {
          }
        },
      );

  }
  ngOnInit(): void {
    this.getProjectInfo();
    this.createForm();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDay();
    this.minEndDate = this.start_date_pro_exp;
    this.maxEndDate =  this.end_date_pro_exp;
    this.minStartDate = this.start_date_pro_exp;
    this.maxStartDate = this.end_date_pro_exp;
  }
  showAddSectionEvent() {
    this.showAddSection = !this.showAddSection;
  }
  createForm() {
    this.sendProject = this.fb.group({
      project_title:  ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
    });
  }

  createUpdateProject(dateStart, dateEnd) {
    if (this.button === 'Add') {
      this.start_date = dateStart;
      this.end_date = dateEnd;
    this.Project = this.sendProject.value;
    this.Project.professional_experience_code = this.professional_experience_code;
    this.Project.project_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-PE-P`;
    if (this.sendProject.valid ) {
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
      this.projectUpdate.professional_experience_code = this.professional_experience_code;
      this.projectUpdate._id = this._id;
      if (this.sendProject.valid) {
        this.resumeService.updateProject(this.projectUpdate).subscribe(data => console.log('project updated =', data));
      this.ProjectArray[this.indexUpdate] = this.projectUpdate;
      this.button = 'Add';
        this.showForm = false; }
    }
    this.sendProject.reset();
    this.showNumberError = false ;
  }
  onShowForm() {
    this.showForm = true;
  }

  editForm(project_code: string, project_title: string, end_date: string, start_date: string, pointIndex: number, _id: string) {
       this.sendProject.patchValue({
      project_title,
      start_date,
      end_date,
    });
    this.project_code = project_code;
    this._id = _id.toString();
    this.indexUpdate = pointIndex;
    this.button = 'Save';
    this.showForm = true;
  }

  deleteProject(_id: string, pointIndex: number, project_code: string) {
    const confirmation = {
      code: 'delete',
      title: 'Delete This Project ?',
      description: 'Are you sure ?',
    };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .subscribe(
        (res) => {
          if (res === true) {
            this.resumeService.deleteProject(_id).subscribe(data => console.log('Deleted'));
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
}

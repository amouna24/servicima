import { Component , OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  minDate: Date;
  maxDate: Date;
  showDateError = false;
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
    console.log(this.professional_experience_code);
    this.resumeService.getProject(
      // tslint:disable-next-line:max-line-length
      `?professional_experience_code=${this.professional_experience_code}`)
      .subscribe(
        (response) => {
          if (response['msg_code'] !== '0004') {
            console.log('response=', response);
            this.ProjectArray = response;
            if (this.ProjectArray.length !== 0) {
              console.log('Project array on init= ', this.ProjectArray);
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
    this.minDate = this.start_date_pro_exp;
    this.maxDate = this.end_date_pro_exp;
    console.log('professional experience code=', this.professional_experience_code);
    this.getProjectInfo();
    this.createForm();
    console.log('on init showForm', this.showForm);
  }
  showAddSectionEvent() {
    this.showAddSection = !this.showAddSection;
  }
  createForm() {
    this.sendProject = this.fb.group({
      project_title: '',
      start_date: '',
      end_date: '',
    });
  }

  createUpdateProject(dateStart, dateEnd) {
    if (this.button === 'Add') {
      this.compareDate(dateStart, dateEnd);
    this.Project = this.sendProject.value;
    this.Project.professional_experience_code = this.professional_experience_code;
    this.Project.project_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-PE-P`;
    if (this.sendProject.valid && this.showDateError === false) {
      this.resumeService.addProject(this.Project).subscribe(data => {
        console.log('Technical skill =', data);
        this.getProjectInfo();
      });
    } else { console.log('Form is not valid');
      this.showDateError = false;
    }
    this.arrayProjectCount++; } else {
      this.projectUpdate = this.sendProject.value;
      this.projectUpdate.project_code = this.project_code;
      this.projectUpdate.professional_experience_code = this.professional_experience_code;
      this.projectUpdate._id = this._id;
      this.resumeService.updateProject(this.projectUpdate).subscribe(data => console.log('project updated =', data));
      this.ProjectArray[this.indexUpdate] = this.projectUpdate;
      this.button = 'Add';
    }
    this.sendProject.reset();
    this.showForm = false;
  }
  routeToProjectSection() {
    this.router.navigate(['/candidate/resume/projects'],
      { state: { id: this.ProjectArray[0].ResumeProjectKey.project_code}
      });
  }

  onShowForm() {
    this.showForm = true;
    console.log(this.showForm);
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

  deleteProject(_id: string, pointIndex: number) {
    const confirmation = {
      code: 'delete',
      title: 'Are you sure ?',
    };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .subscribe(
        (res) => {
          if (res === true) {
            this.resumeService.deleteProject(_id).subscribe(data => console.log('Deleted'));
            this.ProjectArray.forEach((value, index) => {
              if (index === pointIndex) { this.ProjectArray.splice(index, 1); }
            });
            this.subscriptionModal.unsubscribe();
          }
        }
      );

  }
  testRequired() {
    return (this.sendProject.invalid) ;
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

}

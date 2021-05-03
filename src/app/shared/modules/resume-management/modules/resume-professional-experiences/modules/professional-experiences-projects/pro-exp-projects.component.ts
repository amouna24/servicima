import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { UserService } from '@core/services/user/user.service';
import { IResumeProjectModel } from '@shared/models/resumeProject.model';
import { IResumeSectionModel } from '@shared/models/resumeSection.model';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
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
  showAddSection = false;
  showForm = false;
  sendProject_code = 'yow';
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
    private datepipe: DatePipe
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

  createProject() {
    this.Project = this.sendProject.value;
    this.Project.professional_experience_code = this.professional_experience_code;
    this.Project.project_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-PE-P`;
    this.Project.start_date = this.datepipe.transform(this.Project.start_date, 'yyyy/MM/dd');
    this.Project.end_date = this.datepipe.transform(this.Project.end_date, 'yyyy/MM/dd');
    if (this.sendProject.valid) {
      this.resumeService.addProject(this.Project).subscribe(data => console.log('Project =', data));
      this.getProject.push(this.Project);
    } else { console.log('Form is not valid');
    }
    this.arrayProjectCount++;
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
}

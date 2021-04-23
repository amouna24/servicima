import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { UserService } from '@core/services/user/user.service';
import { IResumeProjectModel } from '@shared/models/resumeProject.model';
import { IResumeSectionModel } from '@shared/models/resumeSection.model';
import { Router } from '@angular/router';
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
  project_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-R-PE-P`;
  showAddSection = false;
  get getProject() {
    return this.ProjectArray;
  }
  onShowProject() {
    this.showProject = !this.showProject;
  }

  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private userService: UserService,
    private router: Router
  ) { }
  getProjectInfo() {
    console.log(this.professional_experience_code);
    this.resumeService.getProject(
      // tslint:disable-next-line:max-line-length
      `?professional_experience_code=${this.professional_experience_code.toString()}`)
      .subscribe(
        (response) => {
          console.log('response=', response);
          this.ProjectArray = response;
        },
        (error) => {
          if (error.error.msg_code === '0004') {
          }
        },
      );

  }
  ngOnInit(): void {
    this.createForm();
/*
    this.getProjectInfo();
*/
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
    this.Project.project_code = this.project_code;
    if (this.sendProject.valid) {
/*
      this.resumeService.addProject(this.Project).subscribe(data => console.log('Project =', data));
*/
      this.getProject.push(this.Project);
    } else { console.log('Form is not valid');
    }
    this.arrayProjectCount++;
    this.sendProject.reset();
  }
}

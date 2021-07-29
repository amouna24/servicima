import { Component , OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { UserService } from '@core/services/user/user.service';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { IResumeProjectModel } from '@shared/models/resumeProject.model';
import { Router } from '@angular/router';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';
import { IResumeProfessionalExperienceModel } from '@shared/models/resumeProfessionalExperience.model';

/** File node data with nested structure. */
// tslint:disable-next-line:interface-name
interface MyTreeNode {
  title: string;
  children?: MyTreeNode[];
  expanded?: boolean;
  object?: object;
}
@Component({
  selector: 'wid-pro-exp-projects',
  templateUrl: './pro-exp-projects.component.html',
  styleUrls: ['./pro-exp-projects.component.scss']
})
export class ProExpProjectsComponent implements OnInit {
  treeControl: NestedTreeControl<MyTreeNode>;
  treeDataSource: MatTreeNestedDataSource<MyTreeNode>;
  sendProject: FormGroup;
  arrayProjectCount = 0;
  Project: IResumeProjectModel;
  showProject = false;
  treeItems: MyTreeNode[] = [];
  ProjectArray: IResumeProjectModel[] = [];
  project: string;
  professional_experience_code = this.router.getCurrentNavigation().extras.state?.id;
  customer = this.router.getCurrentNavigation().extras.state?.customer;
  position = this.router.getCurrentNavigation().extras.state?.position;
  start_date_pro_exp = this.router.getCurrentNavigation().extras.state?.start_date;
  end_date_pro_exp = this.router.getCurrentNavigation().extras.state?.end_date;
  showAddSection = false;
  showForm = false;
  resume_code = '';
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
  myDisabledDayFilter: any ;
  openExpansion = false;

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
  ) {
  }

  getProjectInfo() {
    this.ProjectArray = [];
    const disabledDates = [];
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
                  for (const date = new Date(project.start_date) ; date <= new Date(project.end_date) ; date.setDate(date.getDate() + 1)) {
                    disabledDates.push(new Date(date));
                  }
                });
              this.myDisabledDayFilter = (d: Date): boolean => {
                const time = d.getTime();
                return !disabledDates.find(x => x.getTime() === time);
              };
              this.filterDate();
            } else {
              this.showProject = false;
              this.showForm = false;
            }
          } else {
            this.showProject = false;
            this.showForm = false;
          } },
        (error) => {
          if (error.error.msg_code === '0004') {
          }
        },
      );
  }
   async ngOnInit(): Promise<void> {
    this.showProject = false;
     this.treeControl = new NestedTreeControl<MyTreeNode>(this.makeGetChildrenFunction());
     this.treeDataSource = new MatTreeNestedDataSource();
   await this.loadTree();
    this.getProjectInfo();
    this.createForm();
    this.initDates();
  }
  hasChildren = (_: number, node: MyTreeNode) => {
    return node.children && node.children.length > 0;
  };

  private makeGetChildrenFunction() {
    return node => of(node.children);
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
    } else {
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
this.createForm();
this.initDates();
this.filterDate();
this.loadTree();
  }
  onShowForm() {
    this.showForm = true;
  }

  editForm(project_code: string, project_title: string, end_date: string, start_date: string, pointIndex: number, _id: string) {
    let projectEditArray: any[];
    const disabledDates = [];
    this.sendProject.patchValue({
      project_title,
      start_date,
      end_date,
    });
    this.myDisabledDayFilter = null;
    this.project_code = project_code;
    this._id = _id.toString();
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
            this.resumeService.deleteProject(_id).subscribe(data => {
              this.loadTree();
            });
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
                                this.resumeService.deleteProjectDetailsSection(section._id).subscribe(data => {
                                  console.log('Deleted');
                                });
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
  onChangeStartDate(date: string) {
    this.minEndDate = new Date(date);
  }
  onChangeEndDate(date: string) {
    this.maxStartDate = new Date(date);
  }
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
  initDates() {
    this.minEndDate = this.start_date_pro_exp;
    this.maxEndDate =  this.end_date_pro_exp;
    this.minStartDate = this.start_date_pro_exp;
    this.maxStartDate = this.end_date_pro_exp;
  }
  async loadTree() {
    const treeItems = [];
    let i = 0;
    new Promise( (resolve) => {
      this.resumeService.getResume(
        // tslint:disable-next-line:max-line-length
        `?email_address=${this.userService.connectedUser$.getValue().user[0]['userKey']['email_address']}&company_email=${this.userService.connectedUser$.getValue().user[0]['company_email']}`)
        .subscribe(
          (response) => {
            if (response['msg_code'] !== '0004') {
              this.resume_code = response[0].ResumeKey.resume_code.toString();
              this.resumeService.getProExp(
                `?resume_code=${this.resume_code}`)
                .subscribe(async (proExp) => {
                  for (const pro of proExp) {
                    const index = proExp.indexOf(pro);
                    i++;
                    if (pro.ResumeProfessionalExperienceKey.professional_experience_code === this.professional_experience_code) {
                      treeItems.push(
                        {
                          title: pro.customer,
                          children: await this.getProjectNode(pro),
                          expanded: true,
                          object: pro
                        });
                    } else {
                      treeItems.push(
                        {
                          title: pro.customer,
                          children: await this.getProjectNode(pro),
                          expanded: false,
                          object: pro,
                        });
                      }
                    if (pro.ResumeProfessionalExperienceKey.professional_experience_code === this.professional_experience_code) { }
                    if (i === proExp.length) {
                      resolve(treeItems);
                    }
                  }
                });
            }
          });
    }).then( (res: MyTreeNode[]) => {
        this.treeItems = res;
        this.treeDataSource.data = res;
        this.treeDataSource.data.forEach( (expand) => {
          if (expand.expanded === true) {
            this.treeControl.expand(expand);
          }
        });
    });
    this.openExpansion = false;
  }
  async getProjectNode(pro: IResumeProfessionalExperienceModel) {
    let i = 0;
    let result = null;
    const proArray = [];
    await new Promise((resolve) => {
      this.resumeService.getProject(
        // tslint:disable-next-line:max-line-length
        `?professional_experience_code=${pro.ResumeProfessionalExperienceKey.professional_experience_code}`)
        .subscribe(
          (resProject) => {
            if (resProject.length > 0) {
            resProject.forEach((project) => {
              i++;
              proArray.push({
                title: project.project_title,
                object: project,

              });
            });
            if (i === resProject.length) {
              resolve(proArray);
            }
          } else {
              resolve([]);
            }} );
    }).then((res) => {
      result = res;
      return (res);
    });
    return result;
  }
  generateSections(project: IResumeProjectModel) {
    this.project = project.project_title;
    if (this.openExpansion === false) {
      const detailsTree = [];
      this.resumeService.getProjectDetails(`?project_code=${project.project_code}`).subscribe((proj) => {
        if (proj['msg_code'] !== '0004') {
          proj.forEach((pro) => {
            detailsTree.push(
              {
                title: pro.project_detail_title,
              });
          });
          if (detailsTree.length > 0) {
            this.treeDataSource.data.map((node) => {
              node.children.map((nodeChildren) => {
                if (nodeChildren.title === project.project_title) {
                  nodeChildren.children = detailsTree;
                  this.treeControl.expand(nodeChildren);
                }
              });
            });
          }
        }
        const _data = this.treeDataSource.data;
        this.treeDataSource.data = null;
        this.treeDataSource.data = _data;
        this.openExpansion = true;
      });
    } else if (this.openExpansion === true) {
      this.resumeService.getProjectDetails(`?project_code=${project.project_code}`).subscribe((proj) => {
        this.treeDataSource.data.map((node) => {
          node.children.map((nodeChildren) => {
            nodeChildren.children = [];
            const _data = this.treeDataSource.data;
            this.treeDataSource.data = null;
            this.treeDataSource.data = _data;
          });
        });
      });
      this.openExpansion = false;
    }
  }
  async refreshTreeHandler(event: boolean, item) {
    if (event === true) {
      this.openExpansion = false;
      this.generateSections(item);
    }
    return false;
  }
  nodeSelect(event: any) {
    if ((event.title !== this.customer) && (event.object.ResumeProfessionalExperienceKey !== undefined)) {
        this.professional_experience_code = event.object.ResumeProfessionalExperienceKey.professional_experience_code;
        this.customer = event.object.customer;
        this.position = event.object.position;
        this.start_date_pro_exp = event.object.start_date;
        this.end_date_pro_exp = event.object.end_date;
      this.getProjectInfo();
      this.loadTree();
      this.openExpansion = false;
      }
  }
}

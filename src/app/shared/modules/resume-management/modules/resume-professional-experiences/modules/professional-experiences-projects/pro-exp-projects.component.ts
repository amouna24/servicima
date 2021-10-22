import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResumeService } from '@core/services/resume/resume.service';
import { UserService } from '@core/services/user/user.service';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { IResumeProjectModel } from '@shared/models/resumeProject.model';
import { Router } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';
import { IResumeProfessionalExperienceModel } from '@shared/models/resumeProfessionalExperience.model';
import { IMyTreeNode } from '@shared/models/treeView';
import { showBloc, dataAppearance } from '@shared/animations/animations';

@Component({
  selector: 'wid-pro-exp-projects',
  templateUrl: './pro-exp-projects.component.html',
  styleUrls: ['./pro-exp-projects.component.scss'],
  animations: [
    showBloc,
    dataAppearance,
  ]
})
export class ProExpProjectsComponent implements OnInit {
  treeControl: NestedTreeControl<IMyTreeNode>;
  treeDataSource: MatTreeNestedDataSource<IMyTreeNode>;
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
  projectCode: string;
  treeItems: IMyTreeNode[] = [];
  project: string;
  resumeCode: string;
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
  myDisabledDayFilter: any;
  openExpansion: boolean;
  hasChildren: any;

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
  async ngOnInit(): Promise<void> {
    this.hasChildren = (_: number, node: IMyTreeNode) => {
      return node.children && node.children.length > 0;
    };
    this.createForm();
    this.ProjectArray = [];
    this.showProject = false;
    this.showAddSection = false;
    this.showForm = false;
    this.button = 'Add';
    this.showDateError = false;
    this.showNumberError = false;
    this.projectCode = '';
    this.openExpansion = false;
    this.getProjectInfo();
    this.createForm();
    this.initDates();
    this.treeControl = new NestedTreeControl<IMyTreeNode>(this.makeGetChildrenFunction());
    this.treeDataSource = new MatTreeNestedDataSource();
    await this.loadTree();
  }

  /**************************************************************************
   * @description Get Project Data from Resume Service
   *************************************************************************/
  getProjectInfo() {
    this.ProjectArray = [];
    const disabledDates = [];
    this.resumeService.getProject(
      `?professional_experience_code=${this.professionalExperienceCode}`)
      .subscribe(
        (response) => {
          if (response['msg_code'] !== '0004') {
            this.ProjectArray = response.sort( (val1, val2) => {
              return +new Date(val1.start_date) - +new Date(val2.start_date);
            });
            if (this.ProjectArray.length !== 0) {
              this.showProject = true;
              this.showForm = false;
              this.ProjectArray.forEach(
                (project) => {
                  project.project_code = project.ResumeProjectKey.project_code;
                  for (const date = new Date(project.start_date); date <= new Date(project.end_date); date.setDate(date.getDate() + 1)) {
                    disabledDates.push(new Date(date));
                  }
                });
              this.myDisabledDayFilter = (d: Date): boolean => {
                const time = d.getTime();
                return !disabledDates.find(x => x.getTime() === time);
              };
            } else {
              this.showProject = false;
              this.showForm = false;
            }
          } else {
            this.showProject = false;
            this.showForm = false;
          }
        },
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
      project_title: ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      client: ['', Validators.required],
      position: ['', Validators.required]
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
      if (this.sendProject.valid) {
        this.resumeService.addProject(this.Project).subscribe( (data: IResumeProjectModel) => {
          this.resumeService.getProject(
            `?project_code=${data['ResumeProject'].ResumeProjectKey.project_code}`)
            .subscribe(
              (responseOne) => {
                if (responseOne['msg_code'] !== '0004') {
                  this.ProjectArray.push( responseOne[0]);
                }});
        });
        this.showForm = false;
      } else {
        console.log('Form is not valid');
        this.showDateError = false;
      }
      this.arrayProjectCount++;
    } else {
      this.projectUpdate = this.sendProject.value;
      this.projectUpdate.project_code = this.projectCode;
      this.projectUpdate.professional_experience_code = this.professionalExperienceCode;
      this.projectUpdate._id = this.id;
      if (this.sendProject.valid) {
        this.resumeService.updateProject(this.projectUpdate).subscribe(data => {
          console.log('project updated =', data);
          this.ProjectArray.splice( this.indexUpdate, 0, data);
        });
        this.button = 'Add';
        this.showForm = false;
      }
    }
    this.createForm();
    this.initDates();
    this.loadTree();
  }

  /**************************************************************************
   * @description action allows to show or hide project form
   *************************************************************************/
  onShowForm() {
    this.showForm = true;
  }

  /**************************************************************************
   * @description Action allows to to get children from a node
   *************************************************************************/
  private makeGetChildrenFunction() {
    return node => of(node.children);
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
      client: oneProject.client,
      position: oneProject.position,
    });
    this.myDisabledDayFilter = null;
    this.projectCode = oneProject.ResumeProjectKey.project_code;
    this.id = oneProject._id.toString();
    this.indexUpdate = pointIndex;
    this.button = 'Save';
    this.showForm = true;
    this.ProjectArray.splice(pointIndex, 1);
    projectEditArray = [...this.ProjectArray];
    projectEditArray.splice(pointIndex, 1);
    projectEditArray.forEach(
      (project) => {
        project.project_code = project.ResumeProjectKey.project_code;
        for (const date = new Date(project.start_date); date <= new Date(project.end_date); date.setDate(date.getDate() + 1)) {
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
   * @param projectCode it contains the project code
   *************************************************************************/
  deleteProject(id: string, pointIndex: number, projectCode: string) {
    const confirmation = {
      code: 'delete',
      title: 'resume-delete-project',
      description: 'resume-u-sure',
    };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .subscribe(
        (res) => {
          if (res === true) {
            this.resumeService.deleteProject(id).subscribe(data => {
              this.loadTree();
            });
            this.resumeService.getProjectDetails(
              `?project_code=${projectCode}`)
              .subscribe(
                (response) => {
                  if (response['msg_code'] !== '0004') {
                    response.forEach((det) => {
                      this.resumeService.deleteProjectDetails(det._id).subscribe(data => console.log('Deleted'));
                      this.resumeService.getProjectDetailsSection(
                        `?project_details_code=${det.ResumeProjectDetailsKey.project_details_code}`)
                        .subscribe(
                          (responseDet) => {
                            if (responseDet['msg_code'] !== '0004') {
                              responseDet.forEach((section) => {
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
   * @description Initialize Max end Min Dates
   *******************************************************************/
  initDates() {
    if (this.endDateProExp.toString() === 'Current Date') {
      this.maxEndDate = new Date();
      this.maxStartDate = new Date();
    } else {
      this.maxEndDate = this.endDateProExp;
      this.maxStartDate = this.endDateProExp;
    }
    this.minEndDate = this.startDateProExp;
    this.minStartDate = this.startDateProExp;
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
    this.resumeCode = this.router.getCurrentNavigation().extras.state?.resumeCode;
    this.professionalExperienceCode = this.router.getCurrentNavigation().extras.state?.id;
    this.customer = this.router.getCurrentNavigation().extras.state?.customer;
    this.position = this.router.getCurrentNavigation().extras.state?.position;
    this.startDateProExp = this.router.getCurrentNavigation().extras.state?.start_date;
    this.endDateProExp = this.router.getCurrentNavigation().extras.state?.end_date;
  }

  /*******************************************************************
   * @description Load data from resume service and set it in a the tree
   *******************************************************************/
  async loadTree() {
    const treeItems = [];
    let i = 0;
    new Promise((resolve) => {
      if (this.resumeCode) {
        this.resumeService.getProExp(
          `?resume_code=${this.resumeCode}`)
          .subscribe(async (proExp) => {
            for (const pro of proExp) {
              const index = proExp.indexOf(pro);
              i++;
              if (pro.ResumeProfessionalExperienceKey.professional_experience_code === this.professionalExperienceCode) {
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
              if (pro.ResumeProfessionalExperienceKey.professional_experience_code === this.professionalExperienceCode) {
              }
              if (i === proExp.length) {
                resolve(treeItems);
              }
            }
          });
      } else {
        this.resumeService.getResume(
          `?email_address=${this.userService.connectedUser$
            .getValue().user[0]['userKey']['email_address']}&company_email=${this.userService.connectedUser$
            .getValue().user[0]['company_email']}`)
          .subscribe(
            (response) => {
              if (response['msg_code'] !== '0004') {
                this.resumeCode = response[0].ResumeKey.resume_code.toString();
                this.resumeService.getProExp(
                  `?resume_code=${this.resumeCode}`)
                  .subscribe(async (proExp) => {
                    for (const pro of proExp) {
                      const index = proExp.indexOf(pro);
                      i++;
                      if (pro.ResumeProfessionalExperienceKey.professional_experience_code === this.professionalExperienceCode) {
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
                      if (pro.ResumeProfessionalExperienceKey.professional_experience_code === this.professionalExperienceCode) {
                      }
                      if (i === proExp.length) {
                        resolve(treeItems);
                      }
                    }
                  });
              }
            });
      }
    }).then((res: IMyTreeNode[]) => {
      this.treeItems = res;
      this.treeDataSource.data = res;
      this.treeDataSource.data.forEach((expand) => {
        if (expand.expanded === true) {
          this.treeControl.expand(expand);
        }
      });
    });
    this.openExpansion = false;
  }

  /*******************************************************************
   * @description Get the data of the projects of one professional experience
   * @param projectNode the professional experience model
   *******************************************************************/
  async getProjectNode(projectNode: IResumeProfessionalExperienceModel) {
    let i = 0;
    let result = null;
    const proArray = [];
    await new Promise((resolve) => {
      this.resumeService.getProject(
        `?professional_experience_code=${projectNode.ResumeProfessionalExperienceKey.professional_experience_code}`)
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
            }
          });
    }).then((res) => {
      result = res;
      return (res);
    });
    return result;
  }

  /*******************************************************************
   * @description Get the data of the projects of one professional experience
   * @param project the project model
   *******************************************************************/
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

  /*******************************************************************
   * @description get new changes from section component and update it in the tree view
   * @param event event that return true if there is a change
   * @param project generate the project details  of this project
   *******************************************************************/
  async refreshTreeHandler(event: boolean, project: IResumeProjectModel) {
    if (event === true) {
      this.openExpansion = false;
      this.generateSections(project);
    }
    return false;
  }

  /*******************************************************************
   * @description Change from professional experience to other
   * @param event contains the data of the node object
   *******************************************************************/
  nodeSelect(event: any) {
    if ((event.title !== this.customer) && (event.object?.ResumeProfessionalExperienceKey !== undefined)) {
      this.professionalExperienceCode = event.object.ResumeProfessionalExperienceKey.professional_experience_code;
      this.customer = event.object.customer;
      this.position = event.object.position;
      this.startDateProExp = event.object.start_date;
      this.endDateProExp = event.object.end_date;
      this.getProjectInfo();
      this.loadTree();
      this.openExpansion = false;
    }
  }
  /**************************************************************************
   * @description Route to professional experience  page
   *************************************************************************/
  routeToProfessionalExperience() {
    if (this.userService.connectedUser$.getValue().user[0].user_type === 'COMPANY') {
      this.router.navigate(['/manager/resume/professionalExperience'], {
        state: {
          resumeCode: this.resumeCode
        }
      });
    } else if (this.userService.connectedUser$.getValue().user[0].user_type === 'CANDIDATE') {
      this.router.navigate(['/candidate/resume/professionalExperience'], {
        state: {
          resumeCode: this.resumeCode
        }
      });
    } else {
      this.router.navigate(['/collaborator/resume/professionalExperience'], {
        state: {
          resumeCode: this.resumeCode
        }
      });
    }
  }
}

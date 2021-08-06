import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IResumeProjectDetailsSectionModel } from '@shared/models/resumeProjectDetailsSection.model';
import { IResumeProjectDetailsModel } from '@shared/models/resumeProjectDetails.model';
import { ResumeService } from '@core/services/resume/resume.service';
import { Router } from '@angular/router';
import { IViewParam } from '@shared/models/view.model';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { showBloc, showProExp } from '@shared/animations/animations';
import { UserService } from '@core/services/user/user.service';
import { Subscription } from 'rxjs';
import { ModalService } from '@core/services/modal/modal.service';
@Component({
  selector: 'wid-project-section',
  templateUrl: './project-section.component.html',
  styleUrls: ['./project-section.component.scss'],
  animations: [
    showProExp,
    showBloc
  ]
})
export class ProjectSectionComponent implements OnInit {
  sendProSectionDetails: FormGroup;
  sendProDetails: FormGroup;
  arrayProSectionDetailsCount = 0;
  arrayProDetailsCount = 0;
  proDetailsArray: IResumeProjectDetailsModel[];
  proSectionArray: IResumeProjectDetailsSectionModel[];
  proSectionAddArray: IResumeProjectDetailsSectionModel[];
  ProDetails: IResumeProjectDetailsModel;
  ProSectionDetails: IResumeProjectDetailsSectionModel;
  sectionContentUpdate: IResumeProjectDetailsSectionModel;
  projectDetailsCode: string ;
  select: string;
  list: string;
  desc: string;
  secList: IViewParam[];
  refData: { } = { };
  emailAddress: string;
  proDetailUpdate: IResumeProjectDetailsModel;
  subscriptionModal: Subscription;
  @Input() projectCode = '';
  @Output() refreshTree: EventEmitter<boolean> = new EventEmitter(false);
  id = '';
  indexUpdate = 0;
  button = 'Add';
  showDesc: boolean;
  showSec: boolean;
  constructor(
    private refDataService: RefdataService,
    private utilService: UtilsService,
    private userService: UserService,
    private fb: FormBuilder,
    private resumeService: ResumeService,
    private router: Router,
    private modalServices: ModalService,
  ) {
  }

  async ngOnInit() {
    this.select = 'PARAGRAPH';
    this.list = '';
    this.desc = '';
    this.showDesc = true;
    this.showSec = false;
    this.initArrays();
    this.getConnectedUser();
    this.getProjectDetailsInfo();
    this.createFormProDetails();
    this.createFormSectionDetails();
    await this.getSectionRefData();
    this.projectDetailsCode = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-R-PE-P-D`;
    this.sendProDetails.get('select').valueChanges.subscribe(selectedValue => {
      this.select = selectedValue;
    });
  }
  /**************************************************************************
   * @description set refData Data in the section array
   *************************************************************************/
  async getSectionRefData() {
    const data = await this.getRefData();
    this.secList = data['SECTION_TYPE'];
  }
  /**************************************************************************
   * @description Get Language list from RefData and RefType
   * @return refData return the refData relating to the refType SECTION_TYPE
   *************************************************************************/
  async getRefData() {
    const list = ['SECTION_TYPE'];
    this.refData = await this.refDataService
      .getRefData(this.utilService.getCompanyId(this.emailAddress, this.userService.applicationId), this.userService.applicationId,
        list, false);
    return this.refData;
  }
  /**************************************************************************
   * @description Get company email from user Service
   *************************************************************************/
  getConnectedUser() {
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.emailAddress = userInfo['company'][0]['companyKey']['email_address'];
          }
        });
  }
  /**************************************************************************
   * @description Create project details form
   *************************************************************************/
  createFormProDetails() {
    this.sendProDetails = this.fb.group({
      project_detail_title: ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      project_detail_desc: '',
      select: 'PARAGRAPH',
    });
  }
  /**************************************************************************
   *  @description Get Project details Data from Resume Service
   *************************************************************************/
  getProjectDetailsInfo() {
    this.resumeService.getProjectDetails(
      `?project_code=${this.projectCode}`)
      .subscribe(
        (response) => {
          if (response['msg_code'] !== '0004') {
            this.proDetailsArray = response;
          }
        },
        (error) => {
          if (error.error.msg_code === '0004') {
          }
        },
      );

  }
  /****************************************
   * @description Create Project details  Form
   *****************************************/
  createFormSectionDetails() {
    this.sendProSectionDetails = this.fb.group({
      project_details_section_desc: [''],
    });
  }
  /***************************************************************
   * @description Add Project details Section  in the array of project details sections
   *****************************************************************/
  createProSectionDetails() {
    this.ProSectionDetails = this.sendProSectionDetails.value;
    this.ProSectionDetails.project_details_section_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-PE-P-D-S`;
    this.ProSectionDetails.project_details_code = this.projectDetailsCode;
    this.ProSectionDetails.ResumeProjectDetailsSectionKey = {
      project_details_code: this.projectDetailsCode,
      project_details_section_code: this.ProSectionDetails.project_details_section_code
    };
    if (this.sendProSectionDetails.valid) {
      this.proSectionArray.push(this.ProSectionDetails);
      this.proSectionAddArray.push(this.ProSectionDetails);
    } else {
      console.log('Form is not valid');
    }
    this.sendProSectionDetails.reset();
    this.arrayProSectionDetailsCount++;

  }
  /***************************************************************
   * @description Create or update project details and project details section
   *****************************************************************/
  async createProDetails() {
    if (this.button === 'Add') {
      this.ProDetails = this.sendProDetails.value;
      this.ProDetails.project_details_code = this.projectDetailsCode;
      this.ProDetails.project_code = this.projectCode;
      if (this.sendProDetails.valid) {
        this.resumeService.addProjectDetails(this.ProDetails).subscribe((dataProDeta) => {
          this.resumeService.getProjectDetails(
            `?project_details_code=${this.ProDetails.project_details_code}`)
            .subscribe(
              (responseOne) => {
                if (responseOne['msg_code'] !== '0004') {
                  this.proDetailsArray.push( responseOne[0]);
                }});
          this.refreshTree.emit(true);
        });
        if (this.ProSectionDetails !== undefined) {
          this.proSectionAddArray.forEach((sec) => {
            this.resumeService.addProjectDetailsSection(sec).subscribe(dataSection => console.log('Section details =', dataSection));
          });
        }
        this.projectDetailsCode = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-RES-PE-P-D`;
      } else {
        console.log('Form is not valid');
      }
    } else if (this.button === 'Save') {
      this.proDetailUpdate = this.sendProDetails.value;
      this.proDetailUpdate.project_code = this.projectCode;
      this.proDetailUpdate.project_details_code = this.projectDetailsCode;
      this.proDetailUpdate._id = this.id;
      if (this.proSectionAddArray !== undefined) {
        await this.proSectionAddArray.forEach((sec) => {
          this.resumeService.addProjectDetailsSection(sec).subscribe(dataSection => console.log('Section details =', dataSection));
        });
        this.resumeService.updateProjectDetails(this.proDetailUpdate).subscribe(async data => {
          this.proDetailsArray.splice( this.indexUpdate, 1, data);
          this.refreshTree.emit(true);
        });
        this.button = 'Add';
      }   }
      this.proSectionAddArray = [];
      this.arrayProDetailsCount++;
      this.showDesc = true;
      this.showSec = false;
      this.sendProDetails.get('select').valueChanges.subscribe(selectedValue => {
        this.select = selectedValue;
      });
      this.projectDetailsCode = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-R-PE-P-D`;
      this.proSectionArray = [];
      this.refreshTree.emit(true);
    this.createFormProDetails();
  }
  /*****************************************************************
   * @description Action allows to choose between a project details in paragraph format or a list format
   *****************************************************************/
  onSelect() {
    if (this.select === 'PARAGRAPH') {
      this.showDesc = true;
      this.showSec = false;
    } else if (this.select === 'LIST') {
      this.showDesc = !this.showDesc;
      this.showSec = !this.showSec;
    }
  }
  /**************************************************************************
   * @description get data from a selected Project details and set it in the current form
   * @param projectDetail the Project details model
   * @param pointIndex the index of the selected Project details
   *************************************************************************/
  editForm(projectDetail: IResumeProjectDetailsModel, pointIndex: number) {
    this.sendProDetails.patchValue({
      project_detail_title: projectDetail.project_detail_title,
      project_detail_desc: projectDetail.project_detail_desc,
      select: this.select
    });
    this.proDetailsArray.splice( pointIndex, 1);
    if (projectDetail.project_detail_desc === null || projectDetail.project_detail_desc === '') {
      this.resumeService.getProjectDetailsSection(
        `?project_details_code=${projectDetail.ResumeProjectDetailsKey.project_details_code}`)
        .subscribe(
          (response) => {
            if (response['msg_code'] !== '0004') {
              this.proSectionArray = response;
            }
          },
          (error) => {
            if (error.error.msg_code === '0004') {
            }
          },
        );
      this.showDesc = false;
      this.showSec = true;
      this.select = 'LIST';
    } else {
      this.showDesc = true;
      this.showSec = false;
      this.select = 'PARAGRAPH';
    }
    this.projectCode = projectDetail.ResumeProjectDetailsKey.project_code;
    this.projectDetailsCode = projectDetail.ResumeProjectDetailsKey.project_details_code;
    this.id = projectDetail._id.toString();
    this.indexUpdate = pointIndex;
    this.button = 'Save';
  }
  /**************************************************************************
   * @description Delete Selected Project detail
   * @param id the id of the deleted functionnal skill
   * @param pointIndex the index of the deleted Project detail
   * @param project_details_code contains the project details code
   *************************************************************************/
  deleteProject(id: string, pointIndex: number, project_details_code) {
    const confirmation = {
      code: 'delete',
      title: 'resume-delete-pro-det',
      description: 'resume-u-sure',
    };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .subscribe(
        (res) => {
          if (res === true) {
            this.resumeService.deleteProjectDetails(id).subscribe((pro) => {
                this.resumeService.getProjectDetailsSection(`?project_details_code=${pro.project_details_code}`).subscribe((resp) => {
                  if (resp.length !== undefined) {
                    resp.forEach(sec => {
                      this.resumeService.deleteProjectDetailsSection(sec._id).subscribe(secc => {
                        console.log('section deleted', secc);
                      });
                    });
                  }
                });
                this.proDetailsArray.forEach((value, index) => {
                  if (index === pointIndex) {
                    this.proDetailsArray.splice(index, 1);
                  }
                });
                this.button = 'Add';
                this.showDesc = true;
                this.showSec = false;
                this.createFormProDetails();
                this.sendProDetails.get('select').valueChanges.subscribe(selectedValue => {
                  this.select = selectedValue;
                });
                this.proSectionArray = [];
                this.refreshTree.emit(true);
              }
            );
          }
          this.subscriptionModal.unsubscribe();

        });
  }
  /**************************************************************************
   * @description Update a project details section
   * @param projectDetailSection the project details section model
   * @param value the new value of the section content
   * @param pointIndex the index of the project details section
   *************************************************************************/
  EditProDetSection(projectDetailSection: IResumeProjectDetailsSectionModel, value: string, pointIndex: number) {
    this.sectionContentUpdate = {
      ResumeProjectDetailsSectionKey: {
        project_details_code: projectDetailSection.ResumeProjectDetailsSectionKey.project_details_code,
        project_details_section_code: projectDetailSection.ResumeProjectDetailsSectionKey.project_details_section_code,
      },
      project_details_section_desc: value,
      _id: projectDetailSection._id,
      project_details_code: projectDetailSection.ResumeProjectDetailsSectionKey.project_details_code,
      project_details_section_code: projectDetailSection.ResumeProjectDetailsSectionKey.project_details_section_code
    };
    this.proSectionArray[pointIndex].project_details_section_desc = value;
    if (value !== '' && this.sectionContentUpdate._id !== undefined) {
     this.resumeService.updateProjectDetailsSection(this.sectionContentUpdate).subscribe((res) => {
        console.log('section details updated');
      });
    }
  }
  /**************************************************************************
   * @description Delete Selected Project detail section
   * @param id the id of the deleted project details section
   * @param pointIndex the index of the deleted project details section
   *************************************************************************/
  deleteProDetSec(id: string, pointIndex: number) {
    const confirmation = {
      code: 'delete',
      title: 'resume-delete-det-sec',
      description: 'resume-u-sure',
    };
    this.subscriptionModal = this.modalServices.displayConfirmationModal(confirmation, '560px', '300px')
      .subscribe(
        (res) => {
          if (res === true) {
            if (id !== undefined) {
            this.resumeService.deleteProjectDetailsSection(id).subscribe( () => {
              this.proDetailsArray.forEach((value, index) => {
                  this.proSectionArray.splice(pointIndex, 1);
              });
            });
            } else {
              this.proSectionArray.splice(pointIndex, 1);
            }
          }
          this.subscriptionModal.unsubscribe();

        });

  }
  /**************************************************************************
   * @description Initialize all arrays
   *************************************************************************/
  initArrays() {
    this.proDetailsArray = [];
    this.proSectionArray = [];
    this.proSectionAddArray = [];
  }
}
